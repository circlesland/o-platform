import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {BN} from "ethereumjs-util";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {CirclesHub} from "@o-platform/o-circles/dist/circles/circlesHub";
import {TagTransactionDocument} from "../../../shared/api/data/types";
import type {TransactionReceipt} from "web3-core";
import {Environment} from "../../../shared/environment";

export type TransferCirclesContextData = {
  safeAddress: string;
  recipientAddress: string;
  message: string;
  amount: string;
  privateKey: string;
  transitivePath?: TransitivePath;
  receipt:TransactionReceipt;
  pathToRecipient?: {
    tokenOwners: string[];
    sources: string[];
    destinations: string[],
    values: string[]
  };
};


export type TransferCirclesContext = ProcessContext<TransferCirclesContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelRecipientAddress: "",
  labelAmount: ""
};

export type TransitivePathStep = {
  from: string,
  to: string,
  token: string,
  tokenOwner: string,
  value: string
}
export type TransitivePath = {
  flow: string,
  transfers: TransitivePathStep[]
}

export async function fTransferCirclesHashOnly(safeAddress:string, privateKey:string, path:TransitivePath) {
  const gnosisSafeProxy = new GnosisSafeProxy(RpcGateway.get(), safeAddress);

  const tokenOwners = [];
  const sources = [];
  const destinations = [];
  const values = [];

  path.transfers.forEach(transfer => {
    tokenOwners.push(transfer.tokenOwner);
    sources.push(transfer.from);
    destinations.push(transfer.to);
    values.push(new BN(transfer.value));
  });

  const transferTroughTxHash = await new CirclesHub(RpcGateway.get(), Environment.circlesHubAddress).transferTroughTxHash(
      privateKey,
      gnosisSafeProxy,
      tokenOwners,
      sources,
      destinations,
      values
  );

  return transferTroughTxHash;
}

export async function fTransferCircles (safeAddress:string, privateKey:string, path:TransitivePath, message:string) {
  const gnosisSafeProxy = new GnosisSafeProxy(RpcGateway.get(), safeAddress);

  try {
    const tokenOwners = [];
    const sources = [];
    const destinations = [];
    const values = [];

    path.transfers.forEach(transfer => {
      tokenOwners.push(transfer.tokenOwner);
      sources.push(transfer.from);
      destinations.push(transfer.to);
      values.push(new BN(transfer.value));
    });

    const transferTroughResult = await new CirclesHub(RpcGateway.get(), Environment.circlesHubAddress).transferTrough(
      privateKey,
      gnosisSafeProxy,
      tokenOwners,
      sources,
      destinations,
      values
    );

    /*
    let txHashSubscription: Subscription;
    txHashSubscription = transferTroughResult.observable.subscribe(async o => {

    });
     */

    const receipt = transferTroughResult;
    if (receipt && message) {
      const api = await window.o.apiClient.client.subscribeToResult();
      await api.mutate({
        mutation: TagTransactionDocument,
        variables: {
          tag: {
            typeId: "o-banking:transfer:message:1",
            value: message
          },
          transactionHash: receipt.transactionHash
        }
      });
    }
    return receipt;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

const processDefinition = (processId: string) =>
  createMachine<TransferCirclesContext, any>({
    id: `${processId}:transferCircles`,
    initial: "transferCircles",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<TransferCirclesContext, any>("error"),
      transferCircles: {
        id: "transferCircles",
        invoke: {
          src: async (context) => {
            context.data.receipt = await fTransferCircles(
              context.data.safeAddress,
              context.data.privateKey,
              context.data.transitivePath,
              context.data.message);
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        id: 'success',
        type: 'final',
        data: (context, event: PlatformEvent) => {
          return context.data;
        }
      }
    },
  });

export const transferCircles: ProcessDefinition<void, TransferCirclesContextData> = {
  name: "transferCircles",
  stateMachine: <any>processDefinition,
};
