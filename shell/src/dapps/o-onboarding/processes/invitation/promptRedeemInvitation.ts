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
  ClaimInvitationDocument,
  InvitationTransactionDocument,
  RedeemClaimedInvitationDocument,
} from "../../../../shared/api/data/types";

export type RedeemInvitationContextData = {
  inviteCode: string;
};

export type PromptRedeemInvitationContext =
  ProcessContext<RedeemInvitationContextData>;

const editorContent = {
  info: {
    title: "Redeem your invitation",
    description:
      "We will now redeem your invitation. This could take a while...",
    submitButtonText: "Next",
  },
  waitUntilRedeemed: {
    title: "Please wait",
    description:
      "Please wait until your invitation transaction got confirmed and try again in a few seconds.",
    submitButtonText: "Try again",
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
            message: "Please wait, redeeming your Invitation...",
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
                `Couldn't redeem an invitation: ${context.messages["inviteCode"]}`
              );
            }
            if (!claimResult.data.success) {
              context.messages["__"] = claimResult.data.error;
              throw new Error(
                `Couldn't redeem an invitation: ${context.messages["inviteCode"]}`
              );
            }
          },
          onError: "#info",
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
              throw new Error("Invitation is not yet redeemed.");
            }
          },
          onDone: "#success",
          onError: "#waitUntilRedeemed",
        },
      },
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
