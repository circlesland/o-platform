/*
 * displayCurrencies = { CRC, TIME_CRC, EURS }
 */
import Web3 from "web3";
import dayjs from "dayjs";
import { BN } from "ethereumjs-util";
// import { me } from "../../../shared/stores/me";
import { ApiClient } from "../../../shared/apiConnection";

import Layout from "../../../shared/layouts/Layout.svelte";
import { purchase } from "../processes/purchase";
import Icons from "../../../shared/molecules/Icons.svelte";
import Item from "../../../shared/molecules/Select/Item.svelte";
import { _ } from "svelte-i18n";
import { TransitivePath } from "../../o-banking/processes/transferCircles";
import { DirectPathDocument, Profile, QueryDirectPathArgs } from "../../../shared/api/data/types";

import { assetBalances } from "../../../shared/stores/assetsBalances";

import { Currency } from "../../../shared/currency";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";

export class Liquidity {
  public static instance() {
    return this._instance;
  }
  private static _instance: Liquidity = new Liquidity();

  constructor() {}

  public static currencySymbol = { CRC: "c", TIME_CRC: "⦿", EURS: "€" };

  private insufficientFunds: boolean = false;
  private insufficientTrust: { sellerAddress: string; maxFlow: BN; invoiceAmount: string } | undefined = undefined;
  private invoiceAmount: number = 0;
  public checked: Boolean = false;

  private async checkMaxTransferableAmount(sumsBySeller: { [sellerAddress: string]: number }, myCirclesAddress) {
    const maxTransferableAmounts: { sellerAddress: string; maxFlow: string | number }[] = await Promise.all(
      Object.keys(sumsBySeller).map(async (sellerAddress) => {
        const flow = await ApiClient.query<TransitivePath, QueryDirectPathArgs>(DirectPathDocument, {
          from: myCirclesAddress,
          to: sellerAddress,
          amount: RpcGateway.get()
            .utils.toWei(
              (new Currency().convertTimeCirclesToCircles(sumsBySeller[sellerAddress], null) * 10).toString(),
              "ether"
            )
            .toString(),
        });

        return {
          sellerAddress: sellerAddress,
          maxFlow: new Currency().displayAmount(flow.flow == "" ? "0" : flow.flow, null, "EURS"),
        };
      })
    );

    return maxTransferableAmounts;
  }

  public async checkFlow(sumsBySeller, myCirclesAddress) {
    this.checkMaxTransferableAmount(sumsBySeller, myCirclesAddress).then((maxAmountBySeller) => {
      const payableBySeller = maxAmountBySeller.map((maxAmount) => {
        return {
          sellerAddress: maxAmount.sellerAddress,
          payable: parseFloat(maxAmount.maxFlow.toString()) >= sumsBySeller[maxAmount.sellerAddress],
          maxAmount: maxAmount.maxFlow,
        };
      });
      const notPayable = payableBySeller.find((o) => !o.payable);
      if (notPayable && notPayable?.sellerAddress) {
        this.insufficientTrust = <{ sellerAddress: string; maxFlow: BN; invoiceAmount: string }>(<unknown>{
          invoiceAmount: sumsBySeller[notPayable.sellerAddress],
          maxFlow: notPayable.maxAmount,
          sellerAddress: notPayable.sellerAddress,
        });
      } else {
        this.insufficientTrust = undefined;
      }
      this.checked = true;
      // console.log(`Max transferable amount per seller:`, o);
      return true;
    });
  }

  public refresh(crcBalances, sellerAddress, sumsBySeller, myCirclesAddress) {
    if (crcBalances.length > 0 && sumsBySeller && sumsBySeller > 0) {
      const totalCrcBalance = crcBalances.reduce((p, c) => p.add(new BN(c.token_balance)), new BN("0")).toString();

      const balance: any = Currency.instance().displayAmount(totalCrcBalance, null, "EURS", null);

      this.insufficientFunds = balance - parseFloat(sumsBySeller.toFixed(2)) <= 0;

      this.checked = this.insufficientFunds;
      const sellersumArray = {
        sellerAddress: sumsBySeller,
      };
      if (!this.insufficientFunds) {
        this.checkFlow(sellersumArray, myCirclesAddress);
      } else {
        this.insufficientTrust = undefined;
      }
    }
    return this.checked;
  }
}
