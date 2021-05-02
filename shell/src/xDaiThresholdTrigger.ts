import {BN} from "ethereumjs-util";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {Subscription} from "web3-core-subscriptions"
import {BlockHeader} from "web3-eth";

/**
 * Sits there and waits until the specified address has a high enough balance to
 * overcome the threshold.
 */
export class XDaiThresholdTrigger {
  readonly address:string;
  readonly threshold:BN;
  readonly subscription: Subscription<BlockHeader>

  /**
   * Creates a new trigger
   * @param address The address to watch
   * @param threshold The threshold in eth/xdai as number
   * @param f The function that should be triggered once the threshold is reached.
   */
  constructor(address:string, threshold:number, f:(address:string, threshold:number) => Promise<void>) {
    this.address = address;
    this.threshold = new BN(RpcGateway.get().utils.toWei(threshold.toString(), "ether"));

    this.subscription = RpcGateway.get().eth.subscribe("newBlockHeaders", async (error, log) => {

      const weiBalanceStr = await RpcGateway.get().eth.getBalance(this.address);
      const weiBalanceBN = new BN(weiBalanceStr);

      if (!weiBalanceBN.gte(this.threshold)){
        return;
      }

      try {
        await f(address, threshold);
      } catch (e) {
        throw e;
      } finally {
        await this.destroy();
      }
    });
  }

  async destroy() {
    if (this.subscription) {
      await this.subscription.unsubscribe();
    }
  }
}