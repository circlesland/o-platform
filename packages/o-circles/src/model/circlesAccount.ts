import {CirclesHub} from "../circles/circlesHub";
import {CirclesToken} from "./circlesToken";
import {GnosisSafeProxy} from "../safe/gnosisSafeProxy";
import {HUB_ADDRESS, ZERO_ADDRESS} from "../consts";
import {Erc20Token} from "../token/erc20Token";
import {BN} from "ethereumjs-util";
import {SafeOps} from "./safeOps";
import {Observable, Subject} from "rxjs";
import {BlockchainEvent} from "@o-platform/o-events/dist/blockchainEvent";
import {RpcGateway} from "../rpcGateway";
import {TransactionReceipt} from "web3-core";

export interface CirclesAccountModel
{
  readonly safeAddress: string;
}

export class CirclesAccount implements CirclesAccountModel
{
  readonly safeAddress: string;

  private readonly web3 = RpcGateway.get();
  private readonly hub:CirclesHub;

  constructor(safeAddress: string)
  {
    this.safeAddress = safeAddress;
    this.hub = new CirclesHub(this.web3, HUB_ADDRESS);
  }

  async getUBI(privateKey: string, safe: GnosisSafeProxy) : Promise<TransactionReceipt>
  {
    const ownToken = await this.tryGetMyToken();
    if (!ownToken)
    {
      throw new Error(`Couldn't find a personal circles token for the safe '${safe.address}'.`);
    }

    const erc20Contract = new Erc20Token(this.web3, ownToken.tokenAddress);
    const txData = erc20Contract.contract.methods.update().encodeABI();

    return await safe.execTransaction(
      privateKey,
      {
        to: ownToken.tokenAddress,
        data: txData,
        value: new BN("0"),
        refundReceiver: ZERO_ADDRESS,
        gasToken: ZERO_ADDRESS,
        operation: SafeOps.CALL
      });
  }

  async tryGetMyToken(startBlock?:number): Promise<CirclesToken|null>
  {
    if (!this.safeAddress) {
      throw new Error(`The safe address is not known. Your token cannot be loaded.`)
    }
    const result = await this.hub.queryEvents(CirclesHub.queryPastSignup(this.safeAddress, startBlock)).toArray();
    if (result.length == 0)
    {
      return null;
    }

    const signupEvent = result[0];
    const token = new CirclesToken(
        signupEvent.returnValues.token,
        signupEvent.returnValues.user,
        signupEvent.blockNumber
    );
    return token;
  }

  async tryGetTokensBySafeAddress(safeAddresses: string[]): Promise<CirclesToken[]>
  {
    if (safeAddresses.length == 0) {
      throw new Error(`Trying to get tokens by safe address failed because an empty array was supplied.`)
    }
    const tokensBySafeAddress = await this.hub.queryEvents(
      CirclesHub.queryPastSignups(safeAddresses)
    ).toArray();

    return tokensBySafeAddress.map(signupEvent => new CirclesToken(
          signupEvent.returnValues.token,
          signupEvent.returnValues.user,
          signupEvent.blockNumber
      ));
  }

  findHubTransfers(startBlock?:number) : Observable<BlockchainEvent>
  {
    const subject = new Subject<BlockchainEvent>();

    if (!this.safeAddress) {
      throw new Error(`The safe address is not known. Your transactions cannot be loaded.`)
    }

    const outgoingHubTransfers = this.hub.queryEvents(CirclesHub.queryPastTransfers(this.safeAddress, undefined, startBlock));
    outgoingHubTransfers.events.subscribe(hubTransfer =>
    {
      subject.next(hubTransfer);
    });
    const incomingHubTransfers = this.hub.queryEvents(CirclesHub.queryPastTransfers(undefined, this.safeAddress, startBlock));
    incomingHubTransfers.events.subscribe(hubTransfer =>
    {
      subject.next(hubTransfer);
    });

    Promise.all([
      outgoingHubTransfers.execute(),
      incomingHubTransfers.execute()
    ]).then(() => {
      subject.complete();
    }).catch(e => {
      subject.error(e);
    });

    return subject;
  }

  findTrustEvents(startBlock?:number): Observable<BlockchainEvent>
  {
    const subject = new Subject<BlockchainEvent>();

    if (!this.safeAddress) {
      throw new Error(`The safe address is not known. Your contacts cannot be loaded.`)
    }

    const myIncomingTrusts = this.hub.queryEvents(CirclesHub.queryPastTrusts(undefined, this.safeAddress, startBlock));
    myIncomingTrusts.events.subscribe(trustEvent =>
    {
      subject.next(trustEvent);
    });


    const myOutgoingTrusts = this.hub.queryEvents(CirclesHub.queryPastTrusts(this.safeAddress, undefined, startBlock));
    myOutgoingTrusts.events.subscribe(trustEvent =>
    {
      subject.next(trustEvent);
    });

    Promise.all([
      myIncomingTrusts.execute(),
      myOutgoingTrusts.execute()
    ]).then(() => {
      subject.complete();
    }).catch(e => {
      subject.error(e);
    });

    return subject;
  }

  subscribeToTrustEvents(startBlock:number): Observable<BlockchainEvent>
  {
    const subject = new Subject<BlockchainEvent>();

    if (!this.safeAddress) {
      throw new Error(`The safe address is not known. Your contacts cannot be loaded.`)
    }
    const myIncomingTrusts = this.hub.queryEvents(CirclesHub.queryPastTrusts(undefined, this.safeAddress, startBlock));
    myIncomingTrusts.events.subscribe(trustEvent =>
    {
      subject.next(trustEvent);
    });

    myIncomingTrusts.execute();

    const myOutgoingTrusts = this.hub.queryEvents(CirclesHub.queryPastTrusts(this.safeAddress, undefined, startBlock));
    myOutgoingTrusts.events.subscribe(trustEvent =>
    {
      subject.next(trustEvent);
    });

    myOutgoingTrusts.execute();

    return subject;
  }
}
