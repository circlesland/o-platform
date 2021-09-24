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
  ClaimInvitationDocument, RedeemClaimedInvitationDocument
} from "../../../../shared/api/data/types";

export type RedeemInvitationContextData = {
  inviteCode: string;
};

export type PromptRedeemInvitationContext = ProcessContext<RedeemInvitationContextData>;

const editorContent = {
  info: {
    title: "Redeem your invitation",
    description: "We will now redeem your invitation.",
    submitButtonText: "Next",
  },
  success: {
    title: "Success",
    description:
      "You can now proceed with the setup of your account.",
    submitButtonText: "Continue",
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
        invoke: {
          src: async (context) => {
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const claimResult = await apiClient.mutate({
              mutation: RedeemClaimedInvitationDocument,
              variables: {}
            });
            if (claimResult.errors) {
              context.messages["redeemInvitation"] = claimResult.errors.map(o => o.message).join(" \n");
              throw new Error(`Couldn't redeem an invitation: ${context.messages["inviteCode"]}`);
            }
            if (!claimResult.data.success) {
              context.messages["redeemInvitation"] = claimResult.data.error;
              throw new Error(`Couldn't redeem an invitation: ${context.messages["inviteCode"]}`);
            }
          },
          onError: "#info",
          onDone: "#showSuccess"
        }
      },
      showSuccess: prompt({
        id: "showSuccess",
        field: "__",
        component: HtmlViewer,
        params: {
          view: editorContent.success,
          html: () => "",
          hideNav: false,
        },
        navigation: {
          next: "#success",
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

export const promptRedeemInvitation: ProcessDefinition<void, PromptRedeemInvitationContext> = {
  name: "promptRedeemInvitation",
  stateMachine: <any>processDefinition,
};
