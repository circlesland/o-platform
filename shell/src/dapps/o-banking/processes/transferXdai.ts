import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { BN } from "ethereumjs-util";
import {CreateTagInput} from "../../../shared/api/data/types";
import {TransactionReceipt} from "web3-core";

export type TransferXdaiContextData = {
  safeAddress: string;
  recipientAddress: string;
  amount: string;
  privateKey: string;
  receipt:TransactionReceipt;
  message?:string;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type TransferXdaiContext = ProcessContext<TransferXdaiContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelRecipientAddress: "",
  labelAmount: "",
};

const processDefinition = (processId: string) =>
  createMachine<TransferXdaiContext, any>({
    id: `${processId}:transferXdai`,
    initial: "transferXdai",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<TransferXdaiContext, any>("error"),

      transferXdai: {
        id: "transferXdai",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: `Processing xDai transfer ..`,
          });
        },
        invoke: {
          src: async (context) => {
            const ownerAddress =
              RpcGateway.get().eth.accounts.privateKeyToAccount(
                context.data.privateKey
              ).address;

            const gnosisSafeProxy = new GnosisSafeProxy(
              RpcGateway.get(),
              context.data.safeAddress
            );
            const ethAmount = new BN(
              RpcGateway.get().utils.toWei(
                context.data.amount.toString(),
                "ether"
              )
            );
            const receipt = await gnosisSafeProxy.transferEth(
              context.data.privateKey,
              ethAmount,
              context.data.recipientAddress
            );

            const transactionTags: CreateTagInput[] = [];
            if (context.data.message) {
              transactionTags.push({
                typeId: "o-banking:transfer:message:1",
                value: context.data.message
              });
            }
            return receipt;
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

export const transferXdai: ProcessDefinition<void, TransferXdaiContextData> = {
  name: "transferXdai",
  stateMachine: <any>processDefinition,
};
