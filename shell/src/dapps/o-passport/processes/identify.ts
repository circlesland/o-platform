import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import gql from "graphql-tag";
import {authenticate} from "../../o-auth/processes/authenticate";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";
import {upsertIdentity} from "./upsertIdentity";
import {push} from "svelte-spa-router";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type IdentifyContextData = {
  oneTimeCode?:string
  redirectTo?:string
  sessionInfo: {
    isLoggedOn: boolean
    hasProfile: boolean
    profileId: number
  },
  profile: {
    firstName: string
    lastName?: string
    dream: string
    country?: string
    avatarCid?: string
    avatarMimeType?: string
  }
};

export type IdentifyContext = ProcessContext<IdentifyContextData>;

const processDefinition = (processId: string) => createMachine<IdentifyContext, any>({
  id: `${processId}`,
  initial: "getSessionInfo",
  states: {
    // Include a default 'error' state that propagates the error by re-throwing it in an action.
    // TODO: Check if this works as intended
    ...fatalError<IdentifyContext, any>("error"),

    getSessionInfo: {
      id: "getSessionInfo",
      entry: (ctx) => console.log(`enter: identify.getSessionInfo`, ctx.data),
      invoke: {
        src: async (context) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.query({
            query: gql`
              query sessionInfo {
                sessionInfo {
                  isLoggedOn
                  hasProfile
                  profileId
                }
              }`
          });

          if (result.errors && result.errors.length > 0) {
            result.errors.forEach(o => console.error(o));
            throw new Error(`Couldn't query the session info.`);
          }

          context.data.sessionInfo = {
            hasProfile: result.data.sessionInfo.hasProfile,
            isLoggedOn: result.data.sessionInfo.isLoggedOn,
            profileId: result.data.sessionInfo.profileId
          };

          return result.data.sessionInfo;
        },
        onDone: [{
          cond: (context) => context.data.sessionInfo.hasProfile,
          target: "#loadProfile"
        }, {
          cond: (context) => context.data.sessionInfo.isLoggedOn,
          target: "#createProfile"
        }, {
          target: "#authenticate"
        }],
        onError: "#error"
      }
    },
    loadProfile: {
      id: "loadProfile",
      entry: (ctx) => console.log(`enter: identify.loadProfile`, ctx.data),
      invoke: {
        src: async (context) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.query({
            query: gql`
              query profiles {
                profiles(query:{}) {
                  firstName
                  lastName
                  dream
                  country
                  avatarCid
                  avatarMimeType
                }
              }`
          });

          context.data.profile = result.data.profiles && result.data.profiles.length > 0
            ? result.data.profiles[0]
            : undefined;
        },
        onDone: "#success",
        onError: "#error"
      }
    },
    authenticate: {
      id: "authenticate",
      entry: (ctx) => {
        console.log(`enter: identify.authenticate`, ctx.data);
        localStorage.removeItem("me");
      },
      on: {
        ...<any>ipc(`authenticate`)
      },
      invoke: {
        id: "authenticate",
        src: authenticate.stateMachine(`authenticate`),
        data: {
          data: (context, event) => {
            return {
              appId: "__APP_ID__",
              code: context.data.oneTimeCode
            }
          },
          dirtyFlags: {}
        },
        onDone: "#exchangeTokenForSession",
        onError: "#error"
      }
    },
    exchangeTokenForSession: {
      id: "exchangeTokenForSession",
      entry: (ctx) => console.log(`enter: identify.exchangeTokenForSession`, ctx.data),
      on: {
        ...<any>ipc(`exchangeTokenForSession`)
      },
      invoke: {
        id: "exchangeTokenForSession",
        src: async (context, event) => {
          const client = await window.o.apiClient.client.subscribeToResult();
          await client.mutate({
            mutation: gql`
              mutation exchangeToken {
                exchangeToken {
                  success
                  errorMessage
                }
              }`,
            context: {
              headers: {
                "Authorization": event.data
              }
            }
          });
        },
        onDone: "#getSessionInfo",
        onError: "#error"
      }
    },
    createProfile: {
      entry: (ctx) => console.log(`enter: identify.createProfile`, ctx.data),
      id: "createProfile",
      on: {
        ...<any>ipc(`createProfile`)
      },
      invoke: {
        id: "createProfile",
        src: upsertIdentity.stateMachine(`createProfile`),
        data: {
          data: (context, event) => {
            return {
            }
          },
          dirtyFlags: {}
        },
        onDone: "#loadProfile",
        onError: "#error"
      }
    },
    success: {
      type: 'final',
      id: "success",
      entry: (context) => {
        console.log(`enter: identify.success`, context.data);
        window.o.publishEvent(<PlatformEvent>{
          type: "shell.authenticated",
          profile: context.data.profile
        });
        if (context.data.redirectTo) {
          push(context.data.redirectTo);
        }
      },
      data: (context) => {
        return context.data;
      }
    }
  },
});

export const identify: ProcessDefinition<void, IdentifyContextData> = {
  name: "identify",
  stateMachine: <any>processDefinition,
};
