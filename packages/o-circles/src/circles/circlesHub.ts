import Web3 from "web3";
import type {AbiItem} from "web3-utils";
import {CIRCLES_HUB_ABI, ZERO_ADDRESS} from "../consts";
import type {GnosisSafeProxy} from "../safe/gnosisSafeProxy";
import {BN} from "ethereumjs-util";
import {Web3Contract} from "../web3Contract";
import {SafeOps} from "../model/safeOps";
import type {TransactionReceipt} from "web3-core";
import {RpcGateway} from "../rpcGateway";

export class CirclesHub extends Web3Contract {
  constructor(web3: Web3, hubAddress: string) {
    super(
      web3,
      hubAddress,
      new web3.eth.Contract(<AbiItem[]>CIRCLES_HUB_ABI, hubAddress)
    );
  }

  static queryPastSignup(user: string, fromBlock?: number) {
    return {
      event: CirclesHub.SignupEvent,
      filter: {
        user: user,
      },
      fromBlock: fromBlock,
      toBlock: "latest",
    };
  }

  static queryPastSignups(ofUsers?: string[], fromBlock?: number) {
    return {
      event: CirclesHub.SignupEvent,
      filter: ofUsers
        ? {
            user: ofUsers,
          }
        : undefined,
      fromBlock: fromBlock,
      toBlock: "latest",
    };
  }

  static queryPastTransfers(from?: string, to?: string, fromBlock?: number) {
    if (!from && !to)
      throw new Error(
        "At least one of the two parameters has to be set to a value."
      );

    let f: any = {};
    if (from) f.from = from;
    if (to) f.to = to;

    return {
      event: CirclesHub.HubTransferEvent,
      filter: f,
      fromBlock: fromBlock,
      toBlock: "latest",
    };
  }

  static queryPastTrusts(
    canSendTo?: string,
    user?: string,
    fromBlock?: number,
    toBlock?: number
  ) {
    if (!canSendTo && !user)
      throw new Error(
        "At least one of the two parameters has to be set to a value."
      );

    let f: any = {};
    if (canSendTo) f.canSendTo = canSendTo;
    if (user) f.user = user;

    return {
      event: CirclesHub.TrustEvent,
      filter: f,
      fromBlock: fromBlock,
      toBlock: toBlock ?? "latest",
    };
  }

  static readonly SignupEvent = "Signup";
  static readonly HubTransferEvent = "HubTransfer";
  static readonly OrganizationSignupEvent = "OrganizationSignup";
  static readonly TrustEvent = "Trust";

  async signup(
    privateKey: string,
    safeProxy: GnosisSafeProxy
  ): Promise<TransactionReceipt> {
    const txData = this.contract.methods.signup().encodeABI();

    return await safeProxy.execTransaction(privateKey, {
      to: this.address,
      data: txData,
      value: new BN("0"),
      refundReceiver: ZERO_ADDRESS,
      gasToken: ZERO_ADDRESS,
      operation: SafeOps.CALL,
    }, true);
  }

  async signupOrganisation(
    privateKey: string,
    safeProxy: GnosisSafeProxy
  ): Promise<TransactionReceipt> {
    const txData = this.contract.methods.organizationSignup().encodeABI();

    return await safeProxy.execTransaction(privateKey, {
      to: this.address,
      data: txData,
      value: new BN("0"),
      refundReceiver: ZERO_ADDRESS,
      gasToken: ZERO_ADDRESS,
      operation: SafeOps.CALL,
    }, true);
  }

  async setTrust(
    privateKey: string,
    safeProxy: GnosisSafeProxy,
    to: string,
    trustPercentage: BN
  ): Promise<TransactionReceipt> {
    const txData = this.contract.methods.trust(to, trustPercentage).encodeABI();

    const a = await safeProxy.execTransaction(privateKey, {
      to: this.address,
      data: txData,
      value: new BN("0"),
      refundReceiver: ZERO_ADDRESS,
      gasToken: ZERO_ADDRESS,
      operation: SafeOps.CALL,
    }, true);

    return await a;
  }

  async transferThroughTxData(
      privateKey: string,
      safeProxy: GnosisSafeProxy,
      tokenOwners: string[],
      sources: string[],
      destinations: string[],
      values: BN[]
  ) : Promise<string> {
    const transfer = {
      tokenOwners: tokenOwners,
      sources: sources,
      destinations: destinations,
      values: values,
    };

    const txData = await this.contract.methods
        .transferThrough(
            transfer.tokenOwners,
            transfer.sources,
            transfer.destinations,
            transfer.values
        )
        .encodeABI();

    return txData;
  }

  async transferTroughTxHash(
      privateKey: string,
      safeProxy: GnosisSafeProxy,
      tokenOwners: string[],
      sources: string[],
      destinations: string[],
      values: BN[]
  ): Promise<string|null> {
    const innerTxData = await this.transferThroughTxData(privateKey, safeProxy, tokenOwners, sources, destinations, values);
    const outerTxData = await safeProxy.execTransactionTxData(privateKey, {
      to: this.address,
      data: innerTxData,
      value: new BN("0"),
      refundReceiver: ZERO_ADDRESS,
      gasToken: ZERO_ADDRESS,
      operation: SafeOps.CALL,
    }, true);

    return RpcGateway.get().utils.sha3(outerTxData);
  }

  async transferTrough(
    privateKey: string,
    safeProxy: GnosisSafeProxy,
    tokenOwners: string[],
    sources: string[],
    destinations: string[],
    values: BN[]
  ): Promise<TransactionReceipt> {
    const txData = await this.transferThroughTxData(privateKey, safeProxy, tokenOwners, sources, destinations, values);

    return await safeProxy.execTransaction(privateKey, {
      to: this.address,
      data: txData,
      value: new BN("0"),
      refundReceiver: ZERO_ADDRESS,
      gasToken: ZERO_ADDRESS,
      operation: SafeOps.CALL,
    }, true);
  }
}
