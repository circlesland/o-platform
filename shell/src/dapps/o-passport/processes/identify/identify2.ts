import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import { push } from "svelte-spa-router";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { upsertIdentity } from "../upsertIdentity";
import { loadProfile } from "./services/loadProfile";
import { getSessionInfo } from "./services/getSessionInfo";
import { promptChoice } from "./prompts/promptChoice";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";
import { acquireSession } from "./aquireSession/acquireSession2";
import { connectSafe } from "./connectSafe/connectSafe2";
import { createSafe } from "./createSafe/createSafe";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import {
  Profile,
  UpsertProfileDocument,
} from "../../../../shared/api/data/types";
import {Environment} from "../../../../shared/environment";

export type IdentifyContextData = {
  oneTimeCode?: string;
  redirectTo?: string;
  connectOrCreate?: {
    key: string;
    label: string;
  };
  sessionInfo: {
    isLoggedOn: boolean;
    hasProfile: boolean;
    profileId: number;
    hasCirclesKey: boolean;
  };
  profile: Profile;
  privateKey?: string;
};

const strings = {
  choiceYesLabel: window.i18n("dapps.o-passport.processes.identify.identify2.strings.choiceYesLabel"),
  choiceNoLabel: window.i18n("dapps.o-passport.processes.identify.identify2.strings.choiceNoLabel"),
};

const editorContent = {
  connectOrCreate: {
    title: window.i18n("dapps.o-passport.processes.identify.identify2.editorContent.title"),
    description: window.i18n("dapps.o-passport.processes.identify.identify2.editorContent.description"),
    placeholder: "",
    submitButtonText: "",
  },
};

export type IdentifyContext = ProcessContext<IdentifyContextData>;

const processDefinition = (processId: string) =>
  createMachine<IdentifyContext, any>({
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
          src: getSessionInfo,
          onDone: [
            {
              cond: (context, event) => event.data.hasProfile,
              target: "#loadProfile",
            },
            {
              cond: (context, event) =>
                event.data.isLoggedOn && !event.data.hasProfile,
              target: "#upsertIdentity",
            },
            {
              target: "#acquireSession",
            },
          ],
          onError: "#error",
        },
      },

      acquireSession: {
        id: "acquireSession",
        entry: (ctx) => {
          console.log(`enter: identify.acquireSession`, ctx.data);
          localStorage.removeItem("me");
        },
        on: {
          ...(<any>ipc(`acquireSession`)),
        },
        invoke: {
          id: "acquireSession",
          src: acquireSession.stateMachine(`acquireSession`),
          data: {
            data: (context, event) => {
              return {
                appId: Environment.appId,
                code: context.data.oneTimeCode,
              };
            },
            dirtyFlags: {},
            messages: {},
          },
          onDone: "#getSessionInfo",
          onError: "#error",
        },
      },

      loadProfile: {
        id: "loadProfile",
        entry: (ctx) => console.log(`enter: identify.loadProfile`, ctx.data),
        invoke: {
          src: async (context) => {
            const userProfile = await loadProfile();
            if (
              context.data.profile?.circlesAddress &&
              context.data.profile.circlesAddress != userProfile.circlesAddress
            ) {
            } else {
              context.data.profile = userProfile;
            }
          },
          onDone: [
            {
              // Has safe and key?
              cond: (context) =>
                !!context.data.profile.circlesAddress &&
                !!sessionStorage.getItem("circlesKey"),
              target: "#checkSafeAddress",
            },
            {
              // Has no safe but is creating one?
              cond: (context) =>
                !context.data.profile.circlesAddress &&
                !!localStorage.getItem("isCreatingSafe"),
              target: "#checkSafeAddress",
            },
            {
              // Has safe but no key?
              cond: (context) =>
                !!context.data.profile.circlesAddress &&
                !sessionStorage.getItem("circlesKey"),
              target: "#connectSafe",
            },
            {
              // Has no safe
              target: "#connectOrCreate",
            },
          ],
          onError: "#error",
        },
      },

      connectOrCreate: promptChoice({
        id: "connectOrCreate",
        component: ChoiceSelector,
        params: { view: editorContent.connectOrCreate },
        options: [
          {
            key: "connect",
            label: strings.choiceYesLabel,
            target: "#connectSafe",
          },
          {
            key: "create",
            label: strings.choiceNoLabel,
            target: "#createSafe",
          },
        ],
      }),

      connectSafe: {
        id: "connectSafe",
        entry: (ctx) => {
          console.log(`enter: identify.connectSafe`, ctx.data);
          localStorage.removeItem("me");
        },
        on: {
          ...(<any>ipc(`connectSafe`)),
        },
        invoke: {
          id: "connectSafe",
          src: connectSafe.stateMachine(`connectSafe`),
          data: {
            data: (context, event) => {
              return {
                safeAddress: context.data.profile.circlesAddress,
              };
            },
            dirtyFlags: {},
            messages: {},
          },
          onDone: [
            {
              actions: (context, event) => {
                context.data.profile.circlesAddress = event.data.safeAddress;
                context.data.privateKey = event.data.privateKey;
              },
              target: "#upsertSafeAddressAndOwner",
            },
          ],
          onError: "#error",
        },
      },

      createSafe: {
        id: "createSafe",
        entry: (ctx) => {
          console.log(`enter: identify.createSafe`, ctx.data);
        },
        on: {
          ...(<any>ipc(`createSafe`)),
        },
        invoke: {
          id: "createSafe",
          src: createSafe.stateMachine(`createSafe`),
          data: {
            data: (context, event) => {
              return {
                safeAddress: context.data.profile.circlesAddress,
              };
            },
            dirtyFlags: {},
            messages: {},
          },
          onDone: "#upsertSafeAddressAndOwner",
          onError: "#error",
        },
      },

      upsertSafeAddressAndOwner: {
        entry: (ctx) =>
          console.log(`enter: identify.upsertSafeAddressAndOwner`, ctx.data),
        id: "upsertSafeAddressAndOwner",
        on: {
          ...(<any>ipc(`upsertSafeAddressAndOwner`)),
        },
        invoke: {
          src: async (context) => {
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: UpsertProfileDocument,
              variables: {
                ...context.data.profile,
                circlesSafeOwner: sessionStorage.getItem("circlesKey")
                  ? RpcGateway.get().eth.accounts.privateKeyToAccount(
                      sessionStorage.getItem("circlesKey")
                    ).address
                  : undefined,
                status: "",
              },
            });
            context.data.profile = result.data.upsertProfile;
          },
          onDone: "#checkSafeAddress",
          onError: "#error",
        },
      },

      upsertIdentity: {
        entry: (ctx) => console.log(`enter: identify.upsertIdentity`, ctx.data),
        id: "upsertIdentity",
        on: {
          ...(<any>ipc(`upsertIdentity`)),
        },
        invoke: {
          id: "upsertIdentity",
          src: upsertIdentity.stateMachine(`upsertIdentity`),
          data: {
            data: () => {
              return {};
            },
            messages: {},
            dirtyFlags: {},
          },
          onDone: "#loadProfile",
          onError: "#error",
        },
      },

      checkSafeAddress: {
        id: "checkSafeAddress",
        always: [
          {
            cond: (context) => !!context.data.profile.circlesAddress,
            actions: (context) => {
              window.o.publishEvent(<PlatformEvent>{
                type: "shell.authenticated",
                profile: context.data.profile,
              });
              if (context.data.privateKey) {
                localStorage.setItem("circlesKey", context.data.privateKey);
              }
            },
            target: "#success",
          },
          {
            target: "#getInvite",
            actions: (context) => {
              window.o.publishEvent(<PlatformEvent>{
                type: "shell.authenticated",
                profile: context.data.profile,
              });
              if (context.data.privateKey) {
                localStorage.setItem("circlesKey", context.data.privateKey);
              }
            },
          },
        ],
      },

      getInvite: prompt({
        id: "getInvite",
        entry: (context) => {
          const profileLink = `${window.location.protocol}//${window.location.host}/#/contacts/profile/${context.data.profile.id}`;
          (<any>context.data).__getInviteHtml = window.i18n("dapps.o-passport.processes.identify.identify2.getInvite.htmlContext");
        },
        component: HtmlViewer,
        params: {
          html: (context) => (<any>context.data).__getInviteHtml,
          submitButtonText: window.i18n("dapps.o-passport.processes.identify.identify2.getInvite.submitButtonText"),
          hideNav: true,
        },
        field: "__getInviteHtml",
        navigation: {
          next: "#getInvite",
          canGoBack: () => false,
          canSkip: () => false,
        },
      }),

      success: {
        type: "final",
        id: "success",
        entry: (context) => {
          console.log(`enter: identify.success`, context.data);
          /*
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.authenticated",
            profile: context.data.profile,
          });
          if (context.data.privateKey) {
            localStorage.setItem("circlesKey", context.data.privateKey);
          }
           */

          if (context.data.redirectTo) {
            setTimeout(async () => {
              if (context.data.redirectTo.startsWith("http")) {
                if (document.location.href == context.data.redirectTo) {
                  return;
                } else {
                  document.location.href = context.data.redirectTo;
                }
              } else {
                await push(context.data.redirectTo);
              }
            }, 5); // TODO: Check if this is really necessary
          }
        },
        data: (context) => {
          return context.data;
        },
      },
    },
  });

export const identify: ProcessDefinition<void, IdentifyContextData> = {
  name: "identify",
  stateMachine: <any>processDefinition,
};
