import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { push } from "svelte-spa-router";
import * as yup from "yup";
import HtmlViewer from "../../../../../../packages/o-editors/src/HtmlViewer.svelte";
import {
  ClaimInvitationDocument, EventsDocument,
  InvitationTransactionDocument,
  RedeemClaimedInvitationDocument,
} from "../../../../shared/api/data/types";
import {inbox} from "../../../../shared/stores/inbox";

export type RedeemInvitationContextData = {
  inviteCode: string;
};

export type PromptRedeemInvitationContext =
  ProcessContext<RedeemInvitationContextData>;

const editorContent = {
  info: {
    title: window.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.editorContent.info.title"),
    description:window.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.editorContent.info.description"),
    submitButtonText: window.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.editorContent.info.submitButtonText"),
  },
  waitUntilRedeemed: {
    title: window.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.editorContent.waitUntilRedeemed.title"),
    description:window.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.editorContent.waitUntilRedeemed.description"),
    submitButtonText: window.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.editorContent.waitUntilRedeemed.submitButtonText"),
  },
};
const processDefinition = (processId: string) =>
  createMachine<PromptRedeemInvitationContext, any>({
    id: `${processId}:promptRedeemInvitation`,
    initial: "info",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PromptRedeemInvitationContext, any>("error"),

      info: prompt({
        id: "info",
        field: "__",
        component: HtmlViewer,
        params: {
          view: editorContent.info,
          html: () => "",
          hideNav: false,
        },
        navigation: {
          next: "#redeemInvitation",
        },
      }),
      redeemInvitation: {
        id: "redeemInvitation",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.redeemInvitation.message"),
          });
        },
        invoke: {
          src: async (context) => {
            delete context.messages["__"];
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const claimResult = await apiClient.mutate({
              mutation: RedeemClaimedInvitationDocument,
              variables: {},
            });
            if (claimResult.errors) {
              context.messages["__"] = claimResult.errors
                .map((o) => o.message)
                .join(" \n");
              throw new Error(
                window.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.redeemInvitation.error", {values: {contextMessages: context.messages["inviteCode"]}})
              );
            }
            if (!claimResult.data?.redeemClaimedInvitation?.success) {
              context.messages["__"] = claimResult.data.error;
              throw new Error(
                window.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.redeemInvitation.error", {values: {contextMessages: context.messages["inviteCode"]}})
              );
            }
          },
          onError: {
            actions: (context, event) => {
              console.error(window.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitation.redeemInvitation.onError"), event.data);
            },
            target: "#info"
          },
          onDone: "#checkIfRedeemed",
        },
      },
      checkIfRedeemed: {
        id: "checkIfRedeemed",
        invoke: {
          src: async (context) => {
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const claimResult = await apiClient.mutate({
              mutation: InvitationTransactionDocument,
              variables: {},
            });

            if (
              claimResult.errors?.length ||
              !claimResult.data.invitationTransaction?.transaction_hash
            ) {
              throw new Error(window.i18n("dapps.o-onboarding.processes.invitation.promptRedeemInvitartion.checkIfRedemmed.notYetRedeemed"));
            }
          },
          onDone: "#success",
          onError: "#waitUntilRedeemed",
        },
      },
      waitUntilRedeemed: {
        id: "waitUntilRedeemed",
        invoke: {
          src: async () => {
            await new Promise(async (resolve, reject) => {
              const apiClient = await window.o.apiClient.client.subscribeToResult();
              const observable = apiClient.subscribe({
                query: EventsDocument
              });
              let subscription: ZenObservable.Subscription;
              const subscriptionHandler = next => {
                if (next.data.events.type == "blockchain_event") {
                  if (subscription) {
                    subscription.unsubscribe();
                  }
                  resolve(null);
                  // TODO: Close the connection when done
                }
              };
              subscription = observable.subscribe(subscriptionHandler);
            });
          },
          onDone: "#checkIfRedeemed"
        }
      },
      /*
      waitUntilRedeemed: prompt({
        id: "waitUntilRedeemed",
        field: "__",
        component: HtmlViewer,
        params: {
          view: editorContent.waitUntilRedeemed,
          html: () => "",
          hideNav: false,
        },
        navigation: {
          next: "#checkIfRedeemed",
        },
      }),
       */
      success: {
        id: "success",
        type: "final",
        data: (context, event: PlatformEvent) => {
          push("/");
          (<any>window).runInitMachine();
        },
      },
    },
  });

export const promptRedeemInvitation: ProcessDefinition<
  void,
  PromptRedeemInvitationContext
> = {
  name: "promptRedeemInvitation",
  stateMachine: <any>processDefinition,
};
