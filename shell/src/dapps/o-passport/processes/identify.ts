import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import gql from "graphql-tag";
import {authenticate} from "../../o-auth/processes/authenticate";
import {push} from "svelte-spa-router";

export type IdentifyContextData = {
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
  id: `${processId}:identify`,
  initial: "getSessionInfo",
  states: {
    // Include a default 'error' state that propagates the error by re-throwing it in an action.
    // TODO: Check if this works as intended
    ...fatalError<IdentifyContext, any>("error"),

    getSessionInfo: {
      id: "getSessionInfo",
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
      invoke: {
        src: async (context) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.query({
            query: gql`
              query profiles($id:Int!) {
                profiles(query:{
                  id: $id
                }) {
                  firstName
                  lastName
                  dream
                  country
                  avatarCid
                  avatarMimeType
                }
              }`,
            variables: {
              id: context.data.sessionInfo.profileId
            }
          });

          context.data.profile = result.data.profiles && result.data.profiles.length > 0
            ? result.data.profiles[0]
            : undefined;
        },
        onDone: [{
          cond: (context, event) => event.data == true,
          target: "#success"
        }, {
          target: "#createProfile"
        }],
        onError: "#error"
      }
    },
    authenticate: {
      id: "authenticate",
      entry: () => {
        push("/login");
      }
    },
    createProfile: {
      id: "createProfile",
      entry: () => {
        push("/passport/new-passport");
      }
    },
    success: {
      type: 'final',
      id: "success",
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
