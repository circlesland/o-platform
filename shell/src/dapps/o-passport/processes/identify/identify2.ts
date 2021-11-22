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
import {Profile, UpsertProfileDocument} from "../../../../shared/api/data/types";

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
  choiceYesLabel: "Connect",
  choiceNoLabel: "Create New",
};

const editorContent = {
  connectOrCreate: {
    title: "Connect or Create?",
    description:
      "Do you already have a circles Safe address or would you like to create one?",
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
                appId: "__APP_ID__",
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
            const userProfile =  await loadProfile();
            if (context.data.profile?.circlesAddress
              && context.data.profile.circlesAddress != userProfile.circlesAddress) {

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
          const profileLink = `${window.location.protocol}//${window.location.host}/#/friends/${context.data.profile.id}`;
          (<any>context.data).__getInviteHtml = `
          <section class="mb-8">
      <div class="w-full px-2 pb-4 -mt-3 bg-white rounded-sm">
        <div class="px-4 py-2 mr-4 -ml-3 text-center " />
        <div style="text-align: center">
          <p
            class="w-64 m-auto mt-2 text-2xl font-bold  text-gradient"
          >
            You're almost there.
          </p>
          <p class="mt-4 text">
            To activate your citizenship you need to be invited.<br/>
            Send your profile link to a CirclesLand citizen to unlock your basic income.
          </p>
          <div class="mt-4 mb-4 text-xs break-all" id="clipboard">
            <input type="text" class="hidden" value="${profileLink}" />
            <div class="inline-block text-2xl">
              <button class="btn btn-primary" 
                >Copy profile Link</button
              >
            </div>

            <div class="block mt-2 text-sm text-light ">
              ${profileLink}
            </div>
          </div>
          <p class="text">
            If you don't know anybody who has Circles yet, ask nicely in our <a
              href="https://discord.gg/4DBbRCMnFZ"
              target="_blank"
              class="btn-link">Discord</a
            > if someone can activate your citizenship.
          </p>
          <p class="pb-4 mt-4 text-xs text-light">
            alternatively, <a href="#/dashboard/become-a-hub" class="btn-link">unlock yourself</a> and grow a new local community</a>
          </p>
          <div class="mr-1 text-primary" />
        </div>
      </div>
    </section>`;
        },
        component: HtmlViewer,
        params: {
          html: (context) => (<any>context.data).__getInviteHtml,
          submitButtonText: "Close",
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
