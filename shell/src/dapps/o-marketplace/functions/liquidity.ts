/*
 * displayCurrencies = { CRC, TIME_CRC, EURS }
 */
import {ApiClient} from "../../../shared/apiConnection";
import {TransitivePath} from "../../o-banking/processes/transferCircles";
import {DirectPathDocument, QueryDirectPathArgs} from "../../../shared/api/data/types";
import {Currency} from "../../../shared/currency";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

export type PaymentAmountsBySeller = { [sellerAddress: string]: number };
export type PaymentPathsBySeller = {
  [sellerAddress: string]: {
    from: string,
    to: string,
    amount: string,
    path: TransitivePath
  }
};
export type PayableStatusBySeller = {
  [sellerAddress: string]: {
    payable: boolean,
    reason?: string
  }
};

export class Liquidity {
  private static async findPathsToSellers(
    buyerAddress: string,
    sumsBySeller: PaymentAmountsBySeller
  ): Promise<PaymentPathsBySeller> {
    const transitivePathPromises = Object.entries(sumsBySeller).map(async entry => {
      const amountInCrc = (new Currency().convertTimeCirclesToCircles(entry[1], null) * 10).toFixed(8);
      const amountInWei = RpcGateway.get()
        .utils.toWei(amountInCrc, "ether")
        .toString();

      const path = await ApiClient.query<TransitivePath, QueryDirectPathArgs>(DirectPathDocument, {
        from: buyerAddress,
        to: entry[0],
        amount: amountInWei
      });

      return {
        from: buyerAddress,
        to: entry[0],
        amount: amountInWei,
        path: {
          ...path,
          flow: path.flow == "" ? "0" : path.flow
        }
      }
    });

    const paymentPathsBySeller = await Promise.all(transitivePathPromises);
    return paymentPathsBySeller.toLookup(o => o.to, o => o);
  }

  public static async getPayableStatusBySeller(buyerAddress: string, paymentAmountBySeller: PaymentAmountsBySeller): Promise<PayableStatusBySeller> {
    const pathsToSellers = await this.findPathsToSellers(buyerAddress, paymentAmountBySeller);

    return Object.entries(pathsToSellers).reduce((p, c) => {
      const payable = parseFloat(c[1].amount) <= parseFloat(c[1].path.flow);
      const reason = !payable
        ? window.i18n("dapps.o-marketplace.functions.liquidity.maxLiquidityToSellerExceeded")
        : undefined;

      p[c[0]] = {
        payable: payable,
        reason: reason
      };
      return p;
    }, <PayableStatusBySeller>{});
  }
}
