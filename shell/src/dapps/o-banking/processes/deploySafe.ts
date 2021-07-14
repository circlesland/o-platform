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
import {upsertIdentity} from "../../o-passport/processes/upsertIdentity";
import {loadProfile} from "../../o-passport/processes/identify/services/loadProfile";
import {CreateTagInput, Profile, RequestIndexTransactionDocument} from "../data/api/types";
import {UpsertProfileDocument} from "../../o-passport/data/api/types";
import {push} from "svelte-spa-router";
import {Banking} from "../banking";
import {Subscription} from "rxjs";

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


const processDefinition = (processId: string) =>
createMachine<HubSignupContext, any>({
  id: `${processId}:deploySafe`,
  initial: "loadProfile",
  states: {
    ...fatalError<HubSignupContext, any>("error"),

    loadProfile: {
      id: "loadProfile",
      entry: [
        (ctx) => console.log(`enter: identify.loadProfile`, ctx.data),
        () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: `Loading your profile ..`
          });
        }
      ],
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
      entry: () => {
        window.o.publishEvent(<PlatformEvent>{
          type: "shell.progress",
          message: `Finishing your setup (deploying safe) ..`
        });
      },
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
      entry: () => {
        window.o.publishEvent(<PlatformEvent>{
          type: "shell.progress",
          message: `Finishing your setup (connecting the safe to your profile) ..`
        });
      },
      invoke: {
        src: async (context) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.mutate({
            mutation: UpsertProfileDocument,
            variables: {
              ...context.data.profile
            },
          });

          if (result.errors?.length) {
            throw new Error(`An error occurred while storing the safe address to the profile for the first time: ${JSON.stringify(result.errors)}`)
          }

          context.data.profile = result.data.upsertProfile;
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.authenticated",
            profile: context.data.profile
          });

          localStorage.removeItem("isCreatingSafe");
          localStorage.setItem("fundsSafe", "true");

          return {
            ...result.data.upsertProfile
          };
        },
        onDone: "#fundSafe",
        onError: "#error",
      },
    },
    fundSafe: {
      id: "fundSafe",
      entry: () => {
        window.o.publishEvent(<PlatformEvent>{
          type: "shell.progress",
          message: `Finishing your setup (transferring xDai to your new safe) ..`
        });
      },
      invoke: {
        src: async (context) => {
          // Transfer all xdai to the safe except INITIAL_ACCOUNT_XDAI
          await Banking.transferAllAccountXdaiToSafe(context.data.profile.circlesAddress, context.data.privateKey);
          localStorage.removeItem("fundsSafe");
          localStorage.setItem("signsUpAtCircles", "true");
        },
        onDone: "#hubSignup",
        onError: "#error"
      }
    },
    hubSignup: {
      id: "hubSignup",
      entry: () => {
        window.o.publishEvent(<PlatformEvent>{
          type: "shell.progress",
          message: `Finishing your setup (signing you up for UBI) ..`
        });
      },
      invoke: {
        src: async (context) => {
          const hub = new CirclesHub(RpcGateway.get(), HUB_ADDRESS);
          const hubSignupResult = await hub.signup(
              context.data.privateKey,
              new GnosisSafeProxy(RpcGateway.get(), context.data.profile.circlesAddress)
          );

          let txHashSubscription: Subscription;
          txHashSubscription = hubSignupResult.observable.subscribe(async o => {
            if (o.type != "transactionHash") {
              return;
            }
            if (txHashSubscription) {
              txHashSubscription.unsubscribe();
            }

            const transactionTags: CreateTagInput[] = [];
            const api = await window.o.apiClient.client.subscribeToResult();
            await api.mutate({
              mutation: RequestIndexTransactionDocument,
              variables: {
                data: {
                  tags: transactionTags,
                  transactionHash: o.data
                }
              }
            });
          });

          const receipt = await hubSignupResult.toPromise();
          localStorage.removeItem("signsUpAtCircles");
          localStorage.setItem("hubSignup", new Date().toJSON());
          localStorage.setItem("lastUBI", new Date().toJSON());
          console.log("Signed up at hub:", receipt);
        },
        onDone: "#success",
        onError: "#error"
      }
    },
    success: {
      id: 'success',
      type: 'final',
      entry: (context) => {
        push("#/banking/transactions");

        window.o.depositedEvent = <PlatformEvent>{
          type: "shell.authenticated",
          profile: context.data.profile
        };
        //window.o.publishEvent();
      },
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
