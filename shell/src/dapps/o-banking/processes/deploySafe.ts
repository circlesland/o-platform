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
import {loadProfile} from "../../o-passport/processes/identify/services/loadProfile";
import {Profile} from "../data/api/types";
import {UpsertProfileDocument} from "../../o-passport/data/api/types";
import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";

export type HubSignupContextData = {
  privateKey:string;
  deployedProxy?:GnosisSafeProxy;
  profile?: Profile
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

export const INITIAL_ACCOUNT_XDAI = new BN(RpcGateway.get().utils.toWei("0.025", "ether"));

const processDefinition = (processId: string) =>
createMachine<HubSignupContext, any>({
  id: `${processId}:deploySafe`,
  initial: "loadProfile",
  states: {
    ...fatalError<HubSignupContext, any>("error"),

    loadProfile: {
      id: "loadProfile",
      entry: (ctx) => console.log(`enter: identify.loadProfile`, ctx.data),
      invoke: {
        src: async (context) => {
          context.data.profile = await loadProfile();
        },
        onDone: "#checkEntryPoint",
        onError: "#error"
      }
    },

    checkEntryPoint: {
      id: "checkEntryPoint",
      always:[{
        cond: () => !!localStorage.getItem("isCreatingSafe"),
        target: "deploySafe"
      },{
        cond: () => !!localStorage.getItem("fundsSafe"),
        target: "fundSafe"
      },{
        cond: () => !!localStorage.getItem("signsUpAtCircles"),
        target: "hubSignup"
      }]
    },

    deploySafe: {
      id: "deploySafe",
      invoke: {
        src: async (context) => {
          const proxyFactory = new GnosisSafeProxyFactory(RpcGateway.get(), PROXY_FACTORY_ADDRESS, GNOSIS_SAFE_ADDRESS);
          context.data.deployedProxy = await proxyFactory.deployNewSafeProxy(context.data.privateKey);
          context.data.profile.circlesAddress = context.data.deployedProxy.address;
        },
        onDone: "#upsertIdentity",
        onError: "#error",
      },
    },
    upsertIdentity: {
      id: "upsertIdentity",
      invoke: {
        src: async (context) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.mutate({
            mutation: UpsertProfileDocument,
            variables: {
              ...context.data.profile
            },
          });

          localStorage.removeItem("isCreatingSafe");
          localStorage.setItem("fundsSafe", "true");

          window.o.publishEvent(<PlatformEvent>{
            type: "shell.authenticated",
            profile: result.data.upsertProfile,
          });

          return result.data.upsertProfile;
        },
        onDone: "#fundSafe",
        onError: "#error",
      },
    },
    fundSafe: {
      id: "fundSafe",
      invoke: {
        src: async (context) => {
          // Transfer all xdai to the safe except INITIAL_ACCOUNT_XDAI
          const ownerAddress = RpcGateway.get().eth.accounts.privateKeyToAccount(context.data.privateKey).address;
          const totalAccountBalance = new BN(await RpcGateway.get().eth.getBalance(ownerAddress));
          const transferAmount = totalAccountBalance.sub(INITIAL_ACCOUNT_XDAI);

          const signedRawTransaction = await Web3Contract.signRawTransaction(
              ownerAddress,
              context.data.privateKey,
              context.data.profile.circlesAddress,
              "0x00",
              new BN(RpcGateway.get().utils.toWei("28000", "wei")),
              transferAmount);

          const execResult = await Web3Contract.sendSignedRawTransaction(signedRawTransaction);
          const receipt = await execResult.toPromise();
          localStorage.removeItem("fundsSafe");
          localStorage.setItem("signsUpAtCircles", "true");
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
              new GnosisSafeProxy(RpcGateway.get(), context.data.profile.circlesSafeOwner, context.data.profile.circlesAddress)
          );
          const receipt = await hubSignupResult.toPromise();
          localStorage.removeItem("signsUpAtCircles");

          console.log("Signed up at hub:", receipt);
        },
        onDone: "#loadProfile",
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
