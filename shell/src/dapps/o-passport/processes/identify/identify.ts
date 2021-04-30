import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import {ipc} from "@o-platform/o-process/dist/triggers/ipc";
import {push} from "svelte-spa-router";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {upsertIdentity} from "../upsertIdentity";
import {loadProfile} from "./services/loadProfile";
import {getSessionInfo} from "./services/getSessionInfo";
import {connectOrCreate} from "./prompts/connectOrCreate";
import {acquireSession} from "./aquireSession/acquireSession";
import {connectSafe} from "./connectSafe/connectSafe";
import {createSafe} from "./createSafe/createSafe";

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
    hasCirclesKey: boolean
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
  privateKey?:string;
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
        target: "#acquireSession"
      }, {
        target: "#getSessionInfo"
      }]
    },

    getSessionInfo: {
      id: "getSessionInfo",
      entry: (ctx) => console.log(`enter: identify.getSessionInfo`, ctx.data),
      invoke: {
        src: getSessionInfo,
        onDone: [{
          cond: (context, event) => event.data.hasProfile,
          target: "#loadProfile"
        }, {
          cond: (context, event) => event.data.isLoggedOn && !event.data.hasProfile,
          target: "#upsertIdentity"
        }, {
          target: "#acquireSession"
        }],
        onError: "#error"
      }
    },

    acquireSession: {
      id: "acquireSession",
      entry: (ctx) => {
        console.log(`enter: identify.acquireSession`, ctx.data);
        localStorage.removeItem("me");
      },
      on: {
        ...<any>ipc(`acquireSession`)
      },
      invoke: {
        id: "acquireSession",
        src: acquireSession.stateMachine(`acquireSession`),
        data: {
          data: (context, event) => {
            return {
              appId: "__APP_ID__",
              code: context.data.oneTimeCode
            }
          },
          dirtyFlags:{},
          messages:{},
        },
        onDone: "#getSessionInfo",
        onError: "#error"
      }
    },

    loadProfile: {
      id: "loadProfile",
      entry: (ctx) => console.log(`enter: identify.loadProfile`, ctx.data),
      invoke: {
        src: async (context) => {
          context.data.profile = await loadProfile();
        },
        onDone: [{
          // Has safe and key?
          cond: (context) => !!context.data.profile.circlesAddress && !!localStorage.getItem("circlesKey"),
          target: "#success"
        }, {
          // Has no safe but is creating one?
          cond: (context) => !context.data.profile.circlesAddress &&  !!localStorage.getItem("isCreatingSafe"),
          target: "#success"
        }, {
          // Has safe but no key?
          cond: (context) => !!context.data.profile.circlesAddress && !localStorage.getItem("circlesKey"),
          target: "#connectSafe"
        }, {
          // Has no safe
          target: "#connectOrCreate"
        }],
        onError: "#error"
      }
    },

    connectOrCreate: connectOrCreate({
      id: "connectOrCreate",
      promptLabel: strings.choiceLabel,
      createLabel: strings.choiceNoLabel,
      connectLabel: strings.choiceYesLabel,
      onCreate: "#createSafe",
      onConnect: "#connectSafe"
    }),

    connectSafe: {
      id: "connectSafe",
      entry: (ctx) => {
        console.log(`enter: identify.connectSafe`, ctx.data);
        localStorage.removeItem("me");
      },
      on: {
        ...<any>ipc(`connectSafe`)
      },
      invoke: {
        id: "connectSafe",
        src: connectSafe.stateMachine(`connectSafe`),
        data: {
          data: (context, event) => {
            return {
              safeAddress: context.data.profile.circlesAddress
            }
          },
          dirtyFlags:{},
          messages:{},
        },
        onDone: [{
          actions:(context, event) => {
            context.data.profile.circlesAddress = event.data.safeAddress;
            context.data.privateKey = event.data.privateKey;
          },
          target: "#success"
        }],
        onError: "#error"
      }
    },

    createSafe: {
      id: "createSafe",
      entry: (ctx) => {
        console.log(`enter: identify.createSafe`, ctx.data);
      },
      on: {
        ...<any>ipc(`createSafe`)
      },
      invoke: {
        id: "createSafe",
        src: createSafe.stateMachine(`createSafe`),
        data: {
          data: (context, event) => {
            return {
              safeAddress: context.data.profile.circlesAddress
            }
          },
          dirtyFlags:{},
          messages:{},
        },
        onDone:  "#success",
        onError: "#error"
      }
    },

    upsertIdentity: {
      entry: (ctx) => console.log(`enter: identify.upsertIdentity`, ctx.data),
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
        if (context.data.privateKey) {
          localStorage.setItem("circlesKey", context.data.privateKey);
        }
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
