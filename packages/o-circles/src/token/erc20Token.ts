import Web3 from "web3";
import type {AbiItem} from "web3-utils";
import {ERC20_ABI, HUB_BLOCK, ZERO_ADDRESS} from "../consts";
import type {GnosisSafeProxy} from "../safe/gnosisSafeProxy";
import {BN} from "ethereumjs-util";
import {Web3Contract} from "../web3Contract";
import {SafeOps} from "../model/safeOps";
import {Observable, Subject} from "rxjs";
import {BlockchainEvent} from "@o-platform/o-events/dist/blockchainEvent";
import {TransactionReceipt} from "web3-core";

export class Erc20Token extends Web3Contract
{
  constructor(web3: Web3, tokenAddress: string)
  {
    super(web3, tokenAddress, new web3.eth.Contract(<AbiItem[]>ERC20_ABI, tokenAddress));
  }

  static readonly TransferEvent = "Transfer";
  static readonly ApprovalEvent = "Approval";

  static queryPastTransfers(from?: string, to?: string, fromBlock?: number, toBlock?: number)
  {
    if (!from && !to)
      throw new Error("At least one of the two parameters has to be set to a value.");

    let f: any = {};
    if (from)
      f.from = from;
    if (to)
      f.to = to;

    return {
      event: "Transfer",
      filter: f,
      fromBlock: fromBlock ?? HUB_BLOCK,
      toBlock: toBlock ?? "latest"
    };
  }

  findTransfers(safeAddress:string, startBlock?:number) : Observable<BlockchainEvent & {token: Erc20Token}>
  {
    const subject = new Subject<BlockchainEvent & {token: Erc20Token}>();

    const outgoingTokenTransfers = this.queryEvents(Erc20Token.queryPastTransfers(safeAddress, undefined, startBlock));
    outgoingTokenTransfers.events.subscribe(transfer =>
    {
      subject.next({...transfer, token: this});
    });
    const incomingTokenTransfers = this.queryEvents(Erc20Token.queryPastTransfers(undefined, safeAddress, startBlock));
    incomingTokenTransfers.events.subscribe(transfer =>
    {
      subject.next({...transfer, token: this});
    });

    Promise.all([
      outgoingTokenTransfers.execute(),
      incomingTokenTransfers.execute()
    ]).then(() => {
      subject.complete();
    }).catch(e => {
      subject.error(e);
    });

    return subject;
  }

  async transfer(privateKey: string, safeProxy: GnosisSafeProxy, to: string, amount: BN) : Promise<TransactionReceipt>
  {
    const txData = this.contract.methods.transfer(to, amount).encodeABI();

    return await safeProxy.execTransaction(
      privateKey,
      {
        to: this.address,
        data: txData,
        value: new BN("0"),
        refundReceiver: ZERO_ADDRESS,
        gasToken: ZERO_ADDRESS,
        operation: SafeOps.CALL
      });
  }

  async getBalanceOf(address: string)
  {
    const balance = await this.contract.methods.balanceOf(address).call();
    return new BN(balance);
  }
}
