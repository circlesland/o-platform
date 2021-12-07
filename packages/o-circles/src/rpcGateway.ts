import {HttpProvider} from "web3-core";
import {BN} from "ethereumjs-util";
import Web3 from "web3";
import Common from "ethereumjs-common";

export class RpcGateway {
  private static gateway = ""; //"https://rpc.circles.land/";
  private static _web3?: Web3;
  private static _provider?: HttpProvider;

  static setup(rpcEndpoint:string) {
    this.gateway = rpcEndpoint;
  }

  static get(): Web3 {
    if (!this._web3) {
      this.init();
    }
    if (!this._web3) {
      throw new Error(`Couldn't create a web3 instance.`);
    }
    return this._web3;
  }

  static async getEthJsCommon(): Promise<Common> {
    return Common.forCustomChain(
      "mainnet",
      {
        name: "xDai",
        networkId: await this.get().eth.net.getId(),
        chainId: await this.get().eth.getChainId(),
      },
      "istanbul"
    );
  }

  private static _lastGasPrice?: {
    gasPriceInWei: BN;
    time: number;
  };

  static async getGasPrice() {
    const defaultGasPrice = 3;

    if (
      this._lastGasPrice &&
      this._lastGasPrice.time > Date.now() - 60 * 1000
    ) {
      return this._lastGasPrice.gasPriceInWei;
    }

    let gasPriceInWei: BN;
    try {
      const result = await fetch(
        "https://blockscout.com/xdai/mainnet/api/v1/gas-price-oracle"
      );
      const resultJson = await result.json();
      gasPriceInWei = new BN(
        RpcGateway.get()
          .utils.toWei(resultJson.fast.toString(), "gwei")
          .toString()
      );
    } catch (e) {
      console.error(
        `Couldn't get the current gas price from the oracle. Using '${defaultGasPrice}' as hardcoded value:`,
        e
      );
      gasPriceInWei = new BN(
        RpcGateway.get().utils.toWei(defaultGasPrice.toString(), "gwei")
      );
    }

    this._lastGasPrice = {
      gasPriceInWei,
      time: Date.now(),
    };

    return gasPriceInWei;
  }

  static init() {
    if (this.gateway == "")
      throw new Error(`Call setup() first.`);
    if (!this._web3) {
      this._web3 = new Web3();
    }

    const nextProvider = this.gateway;
    this._provider = new Web3.providers.HttpProvider(
      nextProvider,
      {
        timeout: 30000
      }
    );
    this._web3.setProvider(this._provider);
  }
}
