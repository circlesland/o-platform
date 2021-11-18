import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { PromptConnectOrCreateContext } from "../connectOrCreate/promptConnectOrCreate";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { BN } from "ethereumjs-util";
import { EventsDocument } from "../../../../shared/api/data/types";

export type FundSafeFromEoaContextData = {
  eoaAddress: string;
  safeAddress: string;
  successAction?: (data: FundSafeFromEoaContextData) => void;
  errorAction?: (data: FundSafeFromEoaContextData) => void;
};

export type FundSafeFromEoaContext = ProcessContext<FundSafeFromEoaContextData>;

/**
 * Sends all funds (except 0.03 eth) from the "from" address to the "to" address.
 */
async function sendAllFunds(privateKey: string, from: string, to: string) {
  const web3 = RpcGateway.get();
  const minAccBalance = new BN(web3.utils.toWei("0.03", "ether"));
  const eoaBalance = new BN(await web3.eth.getBalance(from));
  const gas = 41000;
  const gasPrice = new BN(await web3.eth.getGasPrice());
  const totalFee = gasPrice.mul(new BN(gas.toString()));
  const nonce = await web3.eth.getTransactionCount(from);

  const availableForTransfer = eoaBalance.sub(totalFee).sub(minAccBalance);

  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const signedTx = await account.signTransaction({
    from: from,
    to: to,
    value: availableForTransfer,
    gasPrice: gasPrice,
    gas: gas,
    nonce: nonce,
  });

  if (!signedTx?.rawTransaction) {
    throw new Error(`Couldn't send the invitation transaction`);
  }

  const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log(receipt);
}

const processDefinition = (processId: string) =>
  createMachine<FundSafeFromEoaContext, any>({
    id: `${processId}:fundSafeFromEoa`,
    initial: "execute",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PromptConnectOrCreateContext, any>("error"),

      execute: {
        id: "execute",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: "adding cash to your Account...",
          });
        },
        invoke: {
          src: async (context) => {
            const privateKey = sessionStorage.getItem("circlesKey");
            if (!privateKey) throw new Error(`The private key is not unlocked`);

            if (
              !context.data.eoaAddress ||
              context.data.eoaAddress == "" ||
              !context.data.safeAddress ||
              context.data.safeAddress == ""
            ) {
              throw new Error(
                `The context's 'eoaAddress' or 'safeAddress' property is not set.`
              );
            }
            await sendAllFunds(
              privateKey,
              context.data.eoaAddress,
              context.data.safeAddress
            );
          },
          onDone: "#waitForTransaction",
        },
      },
      waitForTransaction: {
        id: "waitForTransaction",
        invoke: {
          src: async () => {
            await new Promise(async (resolve, reject) => {
              const apiClient =
                await window.o.apiClient.client.subscribeToResult();
              const observable = apiClient.subscribe({
                query: EventsDocument,
              });
              let subscription: ZenObservable.Subscription;
              const subscriptionHandler = (next) => {
                if (next.data.events.type == "blockchain_event") {
                  if (subscription) {
                    subscription.unsubscribe();
                  }
                  resolve(null);
                  // TODO: Close the connection when done
                }
              };
              subscription = observable.subscribe(subscriptionHandler);
            });
          },
          onDone: "#success",
        },
      },
      success: {
        type: "final",
        id: "success",
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
      },
    },
  });

export const fundSafeFromEoa: ProcessDefinition<
  void,
  FundSafeFromEoaContextData
> = {
  name: "fundSafeFromEoa",
  stateMachine: <any>processDefinition,
};
