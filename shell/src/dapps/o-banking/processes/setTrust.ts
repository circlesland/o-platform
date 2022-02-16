import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {CirclesHub} from "@o-platform/o-circles/dist/circles/circlesHub";
import {BN} from "ethereumjs-util";
import {EditorViewContext} from "@o-platform/o-editors/src/shared/editorViewContext";
import HtmlViewer from "@o-platform/o-editors/src//HtmlViewer.svelte";
import {promptCirclesSafe} from "../../../shared/api/promptCirclesSafe";
import type {TransactionReceipt} from "web3-core";

export type SetTrustContextData = {
  safeAddress: string;
  hubAddress: string;
  privateKey: string;
  trustReceiver?: string;
  trustLimit?: number;
  successAction?: (data:SetTrustContextData) => void;
};

/**
 * This is the context on which the process will work.
 * The actual fields are defined above in the 'AuthenticateContextData' type.
 * The 'AuthenticateContextData' type is also the return value of the process (see bottom for the signature).
 */
export type SetTrustContext = ProcessContext<SetTrustContextData>;

/**
 * In case you want to translate the flow later, it's nice to have the strings at one place.
 */

const editorContent: { [x: string]: EditorViewContext } = {
  recipient: {
    title: window.i18n("dapps.o-banking.processes.setTrust.editorContent.recipient.title"),
    description: window.i18n("dapps.o-banking.processes.setTrust.editorContent.recipient.description"),
    placeholder: window.i18n("dapps.o-banking.setTrust.editorContent.recipient.placeholder"),
    submitButtonText: window.i18n("dapps.o-banking.setTrust.editorContent.recipient.submitButtonText"),
  },
  limit: {
    title: window.i18n("dapps.o-banking.processes.setTrust.editorContent.limit.title"),
    description: window.i18n("dapps.o-banking.processes.setTrust.editorContent.limit.description"),
    submitButtonText: window.i18n("dapps.o-banking.processes.setTrust.editorContent.limit.submitButtonText"),
  },
  message: {
    title: window.i18n("dapps.o-banking.processes.setTrust.editorContent.message.title"),
    description: window.i18n("dapps.o-banking.processes.setTrust.editorContent.message.description"),
    submitButtonText: window.i18n("dapps.o-banking.processes.setTrust.editorContent.message.submitButtonText"),
  },
  confirm: {
    title: window.i18n("dapps.o-banking.processes.setTrust.editorContent.confirm.title"),
    description: window.i18n("dapps.o-banking.processes.setTrust.editorContent.confirm.description"),
    submitButtonText: window.i18n("dapps.o-banking.processes.setTrust.editorContent.confirm.submitButtonText"),
  },
  success: {
    title: window.i18n("dapps.o-banking.processes.setTrust.editorContent.success.title"),
    description: window.i18n("dapps.o-banking.processes.setTrust.editorContent.success.description"),
    submitButtonText: window.i18n("dapps.o-banking.processes.setTrust.editorContent.success.submitButtonText"),
  },
};

export async function fSetTrust(context: ProcessContext<SetTrustContextData>) : Promise<TransactionReceipt> {
  const gnosisSafeProxy = new GnosisSafeProxy(
    RpcGateway.get(),
    context.data.safeAddress
  );

  return await new CirclesHub(
    RpcGateway.get(),
    "__CIRCLES_HUB_ADDRESS__"
  ).setTrust(
    context.data.privateKey,
    gnosisSafeProxy,
    context.data.trustReceiver,
    new BN(context.data.trustLimit.toString())
  );
}

const processDefinition = (processId: string) =>
  createMachine<SetTrustContext, any>({
    id: `${processId}:setTrust`,
    initial: "checkTrustReceiver",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<SetTrustContext, any>("error"),

      checkTrustReceiver: {
        id: "checkTrustReceiver",
        always: [
          {
            cond: (context) => !!context.data.trustReceiver,
            target: "#checkTrustLimit",
          },
          {
            target: "#trustReceiver",
          },
        ],
      },
      trustReceiver: promptCirclesSafe<SetTrustContext, any>({
        field: "trustReceiver",
        onlyWhenDirty: false,
        params: {
          view: editorContent.recipient,
          placeholder: editorContent.recipient.placeholder,
          submitButtonText: editorContent.recipient.submitButtonText,
        },
        navigation: {
          next: "#checkTrustLimit",
        },
      }),
      checkTrustLimit: {
        id: "checkTrustLimit",
        always: [
          {
            cond: (context) =>
              context.data.trustReceiver.toLowerCase() ==
              context.data.safeAddress.toLowerCase(),
            actions: (context) => {
              context.messages["trustReceiver"] =
                window.i18n("dapps.o-banking.processes.setTrust.checkTrustLimit.contectMessage");
            },
            target: "#trustReceiver",
          },
          {
            cond: (context) =>
              context.data.trustLimit !== undefined &&
              context.data.trustLimit !== null,
            target: "#setTrust",
          },
          {
            target: "#trustReceiver",
          },
        ],
      },

      // The code was either manually entered or pre-configured at launch.
      // Exchange it for the actual token and redirect the user to the application.
      setTrust: {
        id: "setTrust",
        entry: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.progress",
            message: window.i18n("dapps.o-banking.processes.setTrust.setTrust.message"),
          });
        },
        invoke: {
          src: async (context) => {
            return await fSetTrust(context);
          },
          onDone: "#showSuccess",
          onError: "#error",
        },
      },
      showSuccess: prompt({
        id: "showSuccess",
        field: "__",
        component: HtmlViewer,
        params: {
          view: editorContent.success,
          html: () => window.i18n("dapps.o-banking.processes.setTrust.showSuccess.html")          ,
          submitButtonText: editorContent.success.submitButtonText,
          hideNav: false,
        },
        navigation: {
          next: "#success",
        },
      }),
      success: {
        type: "final",
        id: "success",
        data: (context, event: PlatformEvent) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
          return window.i18n("dapps.o-banking.proccesses.setTrust.success.return");
        },
      },
    },
  });

export const setTrust: ProcessDefinition<void, SetTrustContext> = {
  name: "setTrust",
  stateMachine: <any>processDefinition,
};
