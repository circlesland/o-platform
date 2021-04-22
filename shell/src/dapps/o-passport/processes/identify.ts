import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import gql from "graphql-tag";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";
import {upsertIdentity} from "./upsertIdentity";
import {push} from "svelte-spa-router";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {authenticate} from "./authenticate";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import ChoiceSelector from "../../../../../packages/o-editors/src/ChoiceSelector.svelte";
import {CreateOrRestoreKeyContext} from "./createOrRestoreKey";
import {importCirclesProfile} from "./importCirclesProfile";
import {ExchangeTokenDocument, MyProfileDocument, SessionInfoDocument} from "../data/api/types";

export type IdentifyContextData = {
  oneTimeCode?:string
  redirectTo?:string
  connectOrCreate?:{
    key:string,
    label:string
  }
  sessionInfo: {
    isLoggedOn: boolean
    hasProfile: boolean
    profileId: number
  },
  profile: {
    circlesAddress?: string
    firstName: string
    lastName?: string
    dream: string
    country?: string
    avatarUrl?: string
    avatarCid?: string
    avatarMimeType?: string
  }
};

const strings = {
  choiceLabel: "Do you already have a circles account?",
  choiceYesLabel: "Yes",
  choiceNoLabel: "No",
}

export type IdentifyContext = ProcessContext<IdentifyContextData>;

const processDefinition = (processId: string) => createMachine<IdentifyContext, any>({
  id: `${processId}`,
  initial: "checkOneTimeCode",
  states: {
    // Include a default 'error' state that propagates the error by re-throwing it in an action.
    // TODO: Check if this works as intended
    ...fatalError<IdentifyContext, any>("error"),

    checkOneTimeCode: {
      entry: () => localStorage.removeItem("me"),
      always:[{
        cond: (context) => !!context.data.oneTimeCode,
        target: "#authenticate"
      }, {
        target: "#getSessionInfo"
      }]
    },

    getSessionInfo: {
      id: "getSessionInfo",
      entry: (ctx) => console.log(`enter: identify.getSessionInfo`, ctx.data),
      invoke: {
        src: async (context) => {
          const apiClient = await window.o.apiClient.client.subscribeToResult();
          const result = await apiClient.query({
            query: SessionInfoDocument
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
          target: "#connectOrCreate"
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
            query: MyProfileDocument
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
          const exchangeResult = await client.mutate({
            mutation: ExchangeTokenDocument,
            context: {
              headers: {
                "Authorization": event.data
              }
            }
          });
          if (exchangeResult.errors && exchangeResult.errors.length > 0) {
            exchangeResult.errors.forEach(o => console.error(o));
          }
          if (!exchangeResult.data?.exchangeToken?.success) {
            throw new Error(`Couldn't exchange the jwt for a session.`);
          }
        },
        onDone: "#getSessionInfo",
        onError: "#error"
      }
    },
    connectOrCreate: prompt<CreateOrRestoreKeyContext, any>({
      fieldName: "connectOrCreate",
      component: ChoiceSelector,
      params: {
        label: strings.choiceLabel,
        choices: [{
          key: "createProfile",
          label: strings.choiceNoLabel
        }, {
          key: "connectProfile",
          label: strings.choiceYesLabel
        }]
      },
      navigation: {
        next: "#checkChoice",
      },
    }),
    checkChoice: {
      id: "checkChoice",
      always: [
        {
          cond: (context) => {
            return context.data.connectOrCreate.key == "createProfile"
          },
          target: "#createProfile",
        },
        {
          cond: (context) => {
            return context.data.connectOrCreate.key == "connectProfile"
          },
          target: "#importProfile",
        },
      ],
    },
    importProfile: {
      id: "importProfile",
      entry: (ctx) => {
        console.log(`enter: identify.importProfile`, ctx.data);
        localStorage.removeItem("me");
      },
      on: {
        ...<any>ipc(`importProfile`)
      },
      invoke: {
        id: "importProfile",
        src: importCirclesProfile.stateMachine(`importProfile`),
        data: {
          data: (context, event) => {
            return {

            }
          },
          dirtyFlags: {}
        },
        onDone: "#createProfile",
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
              circlesAddress: event.data?.circlesAddress,
              firstName: event.data?.firstName,
              lastName: event.data?.lastName,
              dream: event.data?.dream,
              country: event.data?.country,
              avatarUrl: event.data?.avatarUrl,
              avatarCid: event.data?.avatarCid,
              avatarMimeType: event.data?.avatarMimeType,
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
          setTimeout(() => {
            push(context.data.redirectTo);
          }, 5); // TODO: Check if this is really necessary
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
