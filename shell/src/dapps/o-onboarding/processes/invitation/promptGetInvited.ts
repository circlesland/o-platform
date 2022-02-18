import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { actions, createMachine } from "xstate";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import * as yup from "yup";
import HtmlViewer from "../../../../../../packages/o-editors/src/HtmlViewer.svelte";
import { ClaimInvitationDocument } from "../../../../shared/api/data/types";

export type PromptGetInvitedData = {
  needsInvitation: boolean;
  inviteCode: string;
  successAction?: (data: PromptGetInvitedData) => void;
};

export type PromptGetInvitedContext = ProcessContext<PromptGetInvitedData>;

const { assign } = actions;

const editorContent = {
  info: {
    title: window.i18n("dapps.o-onboarding.processes.invitation.promtGetInvited.editorContent.info.title"),
    description: window.i18n("dapps.o-onboarding.processes.invitation.promtGetInvited.editorContent.info.description"),
    submitButtonText: window.i18n("dapps.o-onboarding.processes.invitation.promtGetInvited.editorContent.info.submitButtonText"),
  },
  checkInviteCode: {
    title: window.i18n("dapps.o-onboarding.processes.invitation.promtGetInvited.editorContent.checkInviteCode.title"),
    description: window.i18n("dapps.o-onboarding.processes.invitation.promtGetInvited.editorContent.checkInviteCode.description"),
    submitButtonText: window.i18n("dapps.o-onboarding.processes.invitation.promtGetInvited.editorContent.checkInviteCode.submitButtonText"),
  },
};
const processDefinition = (processId: string) =>
  createMachine<PromptGetInvitedContext, any>({
    id: `${processId}:promptGetInvited`,
    initial: "init",

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

      init: {
        entry: [
          assign((context: PromptGetInvitedContext) => {
            const invite = localStorage.getItem("circlesInvite");
            if (invite && invite != "") {
              console.log("INVITE: ", invite);
              context.data.inviteCode = invite;
              return context;
            }
          }),
        ],
        always: [
          {
            cond: (context) => !context.data.inviteCode,
            target: "inviteCode",
          },
          {
            cond: (context) => !!context.data.inviteCode,
            target: "redeemCode",
          },
        ],
      },

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
          .required(window.i18n("dapps.o-onboarding.processes.invitation.promtGetInvited.dataSchemaRequired")),
        navigation: {
          next: "#redeemCode",
        },
      }),
      redeemCode: {
        id: "redeemCode",
        invoke: {
          src: async (context) => {
            console.log("REDEEMING NOW", context.data.inviteCode);
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
                window.i18n("dapps.o-onboarding.processes.invitation.promptGetInvited.couldNotClaimInvitation", {values: {contextMessages: context.messages["inviteCode"]}})
              );
            }
            if (!claimResult.data.claimInvitation.success) {
              context.messages["inviteCode"] =
                claimResult.data.claimInvitation.error;
              throw new Error(
                window.i18n("dapps.o-onboarding.processes.invitation.promptGetInvited.couldNotClaimInvitation", {values: {contextMessages: context.messages["inviteCode"]}})
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
          localStorage.removeItem("circlesInvite");
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
