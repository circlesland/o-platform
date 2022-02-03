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
import {Environment} from "../../../shared/environment";

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
    title: "Select the person you want to trust",
    description: "",
    placeholder: "Select",
    submitButtonText: "Set trust",
  },
  limit: {
    title: "Please enter the Amount",
    description: "",
    submitButtonText: "Submit",
  },
  message: {
    title: "Transfer Message",
    description: "",
    submitButtonText: "Submit",
  },
  confirm: {
    title: "Confirm",
    description: "",
    submitButtonText: "Confirm",
  },
  success: {
    title: "Trust successful",
    description: "",
    submitButtonText: "Close",
  },
};

export async function fSetTrust(context: ProcessContext<SetTrustContextData>) : Promise<TransactionReceipt> {
  const gnosisSafeProxy = new GnosisSafeProxy(
    RpcGateway.get(),
    context.data.safeAddress
  );

  return await new CirclesHub(
    RpcGateway.get(),
    Environment.circlesHubAddress
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
                '"As soon as you trust yourself, you will know how to live." --Johann Wolfgang von Goethe';
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
            message: `Updating trust ..`,
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
          html: () => `<p>Trust changed</p>`,
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
          return "yeah!";
        },
      },
    },
  });

export const setTrust: ProcessDefinition<void, SetTrustContext> = {
  name: "setTrust",
  stateMachine: <any>processDefinition,
};
