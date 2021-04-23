import {Subscription} from "web3-core-subscriptions";
import {BN} from "ethereumjs-util";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Subject} from "rxjs";
import {Signal} from "@o-platform/o-events/dist/signals/signal";
import {BeginSignal} from "@o-platform/o-events/dist/signals/beginSignal";
import {ProgressSignal} from "@o-platform/o-events/dist/signals/progressSignal";
import {BlockchainEvent} from "@o-platform/o-events/dist/blockchainEvent";
import {EndSignal} from "@o-platform/o-events/dist/signals/endSignal";
import {CirclesTransaction} from "./circlesTransaction";
import {RpcGateway} from "../rpcGateway";

export interface CirclesTokenModel
{
  readonly firstBlock: number;
  readonly tokenAddress: string;
  readonly tokenOwner: string;
}

export class CirclesToken implements CirclesTokenModel
{
  readonly firstBlock: number;
  readonly tokenAddress: string;
  readonly tokenOwner: string;

  constructor(
      tokenAddress: string,
      tokenOwner: string,
      firstBlock: number)
  {
    this.tokenAddress = tokenAddress;
    this.tokenOwner = tokenOwner;
    this.firstBlock = firstBlock;
  }

  wait(milliseconds: number)
  {
    return new Promise<void>(resolve =>
    {
      setTimeout(() => resolve(), milliseconds);
    });
  }

  /**
   * Feeds the transaction history of the specified tokens to the given subject.
   * @param subject The stream
   * @param tokenAddresses The tokens
   * @param fromBlock Start block
   * @param signalKey If a "BeginSignal" and "EndSignal" event should be put on the stream then this parameter must have a value.
   */
  async feedTransactionHistory(
    mySafeAddress: string,
    subject: Subject<PlatformEvent>,
    tokensByAddress:{[tokenAddress:string]:CirclesToken},
    tokenAddresses: string[],
    fromBlock: number,
    signalCallback?: (signal:Signal) => void)
  {
    if (signalCallback)
    {
      signalCallback(new BeginSignal());
    }

    const partitionSize = 50000;
    const timeBetweenPartitions = 500;
    const maxTries = 2;

    const topics = [RpcGateway.get().utils.sha3('Transfer(address,address,uint256)')];
    const currentBlock = await RpcGateway.get().eth.getBlockNumber();
    const partitionCount = Math.ceil((currentBlock - fromBlock) / partitionSize);

    const getFromBlock = (index:number) => fromBlock + index * partitionSize;
    const getToBlock = (index:number) => getFromBlock(index) + partitionSize >= currentBlock
      ? currentBlock
      : getFromBlock(index) + partitionSize;

    for (let partitionIdx = 0; partitionIdx < partitionCount; partitionIdx++)
    {
      let attempt = 1;
      let error = null;

      while (attempt == 1 || (error && attempt <= maxTries))
      {
        try
        {
          if (signalCallback)
          {
            const percent = (partitionIdx + 1) * (100 / partitionCount)

            signalCallback(new ProgressSignal(
              `Updating your transactions ..`, parseInt(percent.toFixed(0))));
          }

          const f = getFromBlock(partitionIdx);
          const t = getToBlock(partitionIdx);
          const pastLogs = await RpcGateway.get().eth.getPastLogs({
            address: tokenAddresses,
            fromBlock: f,
            toBlock: t,
            topics: topics
          });

          // window.o.logger.log(`Received ${pastLogs.length} events from block ${f} to ${t} (partition ${partitionIdx + 1} of ${partitionCount}).`)

          pastLogs.forEach(event =>
          {
            const transfer = <BlockchainEvent>{
              type:"blockchain",
              blockNumber: event.blockNumber,
              blockHash: event.blockHash,
              address: event.address,
              event: "Transfer",
              returnValues: {
                from: RpcGateway.get().eth.abi.decodeParameter("address", event.topics[1]),
                to: RpcGateway.get().eth.abi.decodeParameter("address", event.topics[2]),
                // TODO: Seems to be o.k. according to the docs at https://web3js.readthedocs.io/en/v1.2.7/web3-eth-abi.html#encodeparameter
                value: new BN(<string><any>RpcGateway.get().eth.abi.decodeParameter("uint256", event.data)).toString()
              }
            };

            subject.next(CirclesToken.blockchainEventToCirclesTransaction(mySafeAddress, tokensByAddress, transfer));
          });
        }
        catch (e)
        {
          error = e;
          if (attempt < maxTries)
          {
            console.warn("(Try " + attempt + " of " + maxTries + ") An error occurred while loading the transaction history of tokens:", tokenAddresses);
            console.warn(e);
          }
          else
          {
            throw e;
          }
        }
        attempt++;

        await this.wait(timeBetweenPartitions);
      }
    }

    if (signalCallback)
    {
      signalCallback(new EndSignal());
    }
  }

  static getTransactionId(transaction: CirclesTransaction): string
  {
    return `${transaction.blockNo}_${transaction.token}_${transaction.from}_${transaction.to}_${transaction.amount.toString()}`;
  }

  static blockchainEventToCirclesTransaction(mySafeAddress:string, tokensByAddress:{[tokenAddress:string]:CirclesToken}, blockChainEvent:BlockchainEvent)
  {
    const direction = blockChainEvent.returnValues.to == mySafeAddress ? "in" : "out";
    const circlesTransaction = <CirclesTransaction>{
      tokenOwner: tokensByAddress[blockChainEvent.address].tokenOwner,
      token: blockChainEvent.address,
      blockNo: Number.isInteger(blockChainEvent.blockNumber) ? <number><any>blockChainEvent.blockNumber : blockChainEvent.blockNumber,
      from: blockChainEvent.returnValues.from,
      to: blockChainEvent.returnValues.to,
      cached: blockChainEvent.cached,
      amount: BN.isBN(blockChainEvent.returnValues.value) ? <BN>blockChainEvent.returnValues.value : new BN(blockChainEvent.returnValues.value),
      direction: direction,
      subject: "",
      id: ""
    };
    circlesTransaction.id = CirclesToken.getTransactionId(circlesTransaction);
    return circlesTransaction;
  }

  subscribeToTransactions(
      subject:Subject<PlatformEvent>,
      mySafeAddress:string,
      tokensByAddress:{[tokenAddress:string]:CirclesToken},
      tokenAddresses:string[])
      : Subscription<any>
  {
    const topics = [RpcGateway.get().utils.sha3('Transfer(address,address,uint256)')];
    const subscription = RpcGateway.get().eth.subscribe("logs", {
      address: tokenAddresses,
      topics: topics
    });

    return subscription.on("data", event =>
    {
      const transfer = <BlockchainEvent>{
        type:"blockchain",
        blockNumber: event.blockNumber,
        blockHash: event.blockHash,
        address: event.address,
        event: "Transfer",
        returnValues: {
          from: RpcGateway.get().eth.abi.decodeParameter("address", event.topics[1]),
          to: RpcGateway.get().eth.abi.decodeParameter("address", event.topics[2]),
          // TODO: Seems to be o.k. according to the docs at https://web3js.readthedocs.io/en/v1.2.7/web3-eth-abi.html#encodeparameter
          value: new BN(<string><any>RpcGateway.get().eth.abi.decodeParameter("uint256", event.data)).toString()
        }
      };

      subject.next(CirclesToken.blockchainEventToCirclesTransaction(mySafeAddress, tokensByAddress, transfer));
    });
  }
}
