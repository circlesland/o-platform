import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {BN} from "ethereumjs-util";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import PaymentPath from "../../../shared/molecules/PaymentPath.svelte";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {CirclesHub} from "@o-platform/o-circles/dist/circles/circlesHub";
import {HUB_ADDRESS} from "@o-platform/o-circles/dist/consts";
import {requestPathToRecipient} from "../services/requestPathToRecipient";
import {show} from "@o-platform/o-process/dist/actions/show";

export type TransferCirclesContextData = {
  safeAddress:string;
  recipientAddress:string;
  amount:string;
  privateKey:string;
  transitivePath?:TransitivePath;
  pathToRecipient?: {
    tokenOwners: string[];
    sources: string[];
    destinations: string[],
    values: string[]
  };
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type TransferCirclesContext = ProcessContext<TransferCirclesContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
  labelRecipientAddress: "",
  labelAmount: ""
};

export type TransitivePath = {
  flow: string,
  transfers: [{
    from:string,
    to:string,
    token:string,
    tokenOwner:string,
    value: string
  }]
}

const processDefinition = (processId: string) =>
createMachine<TransferCirclesContext, any>({
  id: `${processId}:transferCircles`,
  initial: "requestPathToRecipient",
  states: {
    // Include a default 'error' state that propagates the error by re-throwing it in an action.
    // TODO: Check if this works as intended
    ...fatalError<TransferCirclesContext, any>("error"),

    requestPathToRecipient: {
      id: "requestPathToRecipient",
      invoke: {
        src: async (context) => {
          context.data.transitivePath = await requestPathToRecipient(context);
        },
        onDone:  "#transferCircles",
        onError: "#error"
      }
    },
    transferCircles: {
      id: "transferCircles",
      entry: <any>show({
        field: "__",
        component: PaymentPath,
        params: (context) => {
          return {
            hideNav: true,
            label: "Transferring Circles ..",
            transfers: context.data.transitivePath.transfers
          }
        },
        navigation: {
          canGoBack: () => false,
          canSkip: () => false,
        }
      }),
      invoke: {
        src: async (context) => {
          const ownerAddress = RpcGateway.get()
            .eth
            .accounts
            .privateKeyToAccount(context.data.privateKey)
            .address;

          const gnosisSafeProxy = new GnosisSafeProxy(RpcGateway.get(), context.data.safeAddress);

          try {
            const tokenOwners = [];
            const sources = [];
            const destinations = [];
            const values = [];

            context.data.transitivePath.transfers.forEach(transfer => {
              tokenOwners.push(transfer.tokenOwner);
              sources.push(transfer.from);
              destinations.push(transfer.to);
              values.push(new BN(transfer.value));
            });

            const transferTroughResult = await new CirclesHub(RpcGateway.get(), HUB_ADDRESS).transferTrough(
              context.data.privateKey,
              gnosisSafeProxy,
              tokenOwners,
              sources,
              destinations,
              values
            );
            const receipt = await transferTroughResult.toPromise();
            console.log(receipt);
          } catch (e) {
            console.error(e);
            throw e;
          }
        },
        onDone: "#success",
        onError: "#error",
      },
    },
    success: {
      id: 'success',
      type: 'final',
      data: (context, event: PlatformEvent) => {
        return "yeah!";
      }
    }
  },
});

export const transferCircles: ProcessDefinition<void, TransferCirclesContextData> = {
  name: "transferCircles",
  stateMachine: <any>processDefinition,
};
