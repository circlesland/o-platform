import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {GnosisSafeProxyFactory} from "@o-platform/o-circles/dist/safe/gnosisSafeProxyFactory";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {GNOSIS_SAFE_ADDRESS, HUB_ADDRESS, PROXY_FACTORY_ADDRESS} from "@o-platform/o-circles/dist/consts";
import {CirclesHub} from "@o-platform/o-circles/dist/circles/circlesHub";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {Web3Contract} from "@o-platform/o-circles/dist/web3Contract";
import {BN} from "ethereumjs-util";
import {upsertIdentity} from "../../o-passport/processes/upsertIdentity";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";

export type HubSignupContextData = {
  privateKey:string;
  deployedProxy?:GnosisSafeProxy;
  safeAddress?:string;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type HubSignupContext = ProcessContext<HubSignupContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */
const strings = {
};

const processDefinition = (processId: string) =>
createMachine<HubSignupContext, any>({
  id: `${processId}:deploySafe`,
  initial: "deploySafe",
  states: {
    ...fatalError<HubSignupContext, any>("error"),

    deploySafe: {
      id: "deploySafe",
      invoke: {
        src: async (context) => {
          const proxyFactory = new GnosisSafeProxyFactory(RpcGateway.get(), PROXY_FACTORY_ADDRESS, GNOSIS_SAFE_ADDRESS);
          context.data.deployedProxy = await proxyFactory.deployNewSafeProxy(context.data.privateKey);
          context.data.safeAddress = context.data.deployedProxy.address;
        },
        onDone: "#success",
        onError: "#error",
      },
    },
    fundSafe: {
      id: "fundSafe",
      invoke: {
        src: async (context) => {
          // Transfer 0,075 xdai to the safe
          // Keep 0.025 xdai on the account
          const ownerAddress = RpcGateway.get().eth.accounts.privateKeyToAccount(context.data.privateKey).address;

          const signedRawTransaction = await Web3Contract.signRawTransaction(
              ownerAddress,
              context.data.privateKey,
              context.data.safeAddress,
              "0x",
              new BN(RpcGateway.get().utils.toWei("0.001", "ether")),
              new BN("0.075"));

          const execResult = await Web3Contract.sendSignedRawTransaction(signedRawTransaction);
          const receipt = await execResult.toPromise();
        },
        onDone: "#hubSignup",
        onError: "#error"
      }
    },
    hubSignup: {
      id: "hubSignup",
      invoke: {
        src: async (context) => {
          const hub = new CirclesHub(RpcGateway.get(), HUB_ADDRESS);
          const hubSignupResult = await hub.signup(
              context.data.privateKey,
              context.data.deployedProxy
          );
        }
      }
    },
    upsertIdentity: {
      entry: (ctx) => console.log(`enter: deploySafe.upsertIdentity`, ctx.data),
      id: "upsertIdentity",
      on: {
        ...<any>ipc(`upsertIdentity`)
      },
      invoke: {
        id: "upsertIdentity",
        src: upsertIdentity.stateMachine(`upsertIdentity`),
        data: {
          data: () => {
            return {
            }
          },
          messages: {},
          dirtyFlags: {}
        },
        onDone: "#success",
        onError: "#error"
      }
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

export const deploySafe: ProcessDefinition<void, HubSignupContextData> = {
  name: "hubSignup",
  stateMachine: <any>processDefinition,
};
