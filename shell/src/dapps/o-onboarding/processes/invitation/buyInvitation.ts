import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import * as yup from "yup";
import HtmlViewer from "../../../../../../packages/o-editors/src/HtmlViewer.svelte";
import { ClaimInvitationDocument } from "../../../../shared/api/data/types";
import { loadProfile } from "../../../o-passport/processes/identify/services/loadProfile";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { BN } from "ethereumjs-util";

export type PromptGetInvitedData = {
  needsInvitation: boolean;
  inviteCode: string;
  successAction?: (data: PromptGetInvitedData) => void;
};

export type PromptGetInvitedContext = ProcessContext<PromptGetInvitedData>;

const editorContent = {
  info: {
    title: "Get invited",
    description: "Find somebody who can give you an invite code to join.",
    submitButtonText: "I have a code",
  },
  checkInviteCode: {
    title: "Enter invitation code",
    description: "Please enter you invitation code below to get started.",
    submitButtonText: "Verify",
  },
};
const processDefinition = (processId: string) =>
  createMachine<PromptGetInvitedContext, any>({
    id: `${processId}:promptGetInvited`,
    initial: "info",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<PromptGetInvitedContext, any>("error"),
      /*
      checkEoaBalance: {
        id: "checkEoaBalance",
        invoke: {
          src: async (context) => {
            const myProfile = await loadProfile();
            const eoaBalance = await RpcGateway.get().eth.getBalance(myProfile.circlesSafeOwner);
            context.data.needsInvitation = new BN(eoaBalance).lt(new BN("1"));
          },
          onDone: [{
            cond: (context) => !context.data.needsInvitation,
            target: "#success"
          },{
            cond: (context) => context.data.needsInvitation,
            target: "#info"
          }]
        }
      },
      */

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
          next: "#inviteCode",
        },
      }),
      inviteCode: prompt<PromptGetInvitedContext, any>({
        field: "inviteCode",
        component: TextareaEditor,
        params: {
          view: editorContent.checkInviteCode,
        },
        dataSchema: yup
          .string()
          .required("Please enter a valid invitation code to proceed."),
        navigation: {
          next: "#redeemCode",
        },
      }),
      redeemCode: {
        id: "redeemCode",
        invoke: {
          src: async (context) => {
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const claimResult = await apiClient.mutate({
              mutation: ClaimInvitationDocument,
              variables: {
                code: context.data.inviteCode,
              },
            });
            if (claimResult.errors) {
              context.messages["inviteCode"] = claimResult.errors
                .map((o) => o.message)
                .join(" \n");
              throw new Error(
                `Couldn't claim an invitation: ${context.messages["inviteCode"]}`
              );
            }
            if (!claimResult.data.claimInvitation.success) {
              context.messages["inviteCode"] =
                claimResult.data.claimInvitation.error;
              throw new Error(
                `Couldn't claim an invitation: ${context.messages["inviteCode"]}`
              );
            }
          },
          onError: "#inviteCode",
          onDone: "#success",
        },
      },

      success: {
        id: "success",
        type: "final",
        entry: (context, event: PlatformEvent) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
      },
    },
  });

export const promptGetInvited: ProcessDefinition<
  void,
  PromptGetInvitedContext
  > = {
  name: "promptGetInvited",
  stateMachine: <any>processDefinition,
};
