import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import {promptChoice, PromptChoiceSpec} from "../../o-passport/processes/identify/prompts/promptChoice";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";
import {performOauth} from "../../o-humanode/processes/performOauth";
import QrCodeViewer from "@o-platform/o-editors/src/QrCodeViewer.svelte";
import {me} from "../../../shared/stores/me";

export type GetTrustedByShopContextData = {
  successAction?: (data: GetTrustedByShopContextData) => void;
};

export type GetTrustedByShopContext = ProcessContext<GetTrustedByShopContextData>;

const processDefinition = (processId: string) =>
  createMachine<GetTrustedByShopContext, any>({
    id: `${processId}:getTrustedByShop`,
    initial: "info",
    states: {
      ...fatalError<GetTrustedByShopContext, any>("error"),
      info: promptChoice(<PromptChoiceSpec<any, any>>{
        id: "info",
        options:[{
          key: "getTrusted",
          target: "#getTrusted",
          label: "Get trusted by the owner"
        }, {
          key: "proofUniqueness",
          target: "#proofUniqueness",
          label: "Proof you're unique"
        }],
        params: {
          view: {
            title: "This location doesn't accept your circles.",
            description: "<b>What can I do?</b>"
          }
        },
        component: ChoiceSelector,
        navigation: {
          canSkip: () => false,
          canGoBack: () => false,
          next: "#success"
        }
      }),
      getTrusted: prompt({
        id: "getTrusted",
        field: {
          name: "getTrusted",
          get: () => {
            let $me = null;
            me.subscribe(m => $me = m)();
            return $me.circlesAddress;
          },
          set: (val:any) => {}
        },
        component: QrCodeViewer,
        params: {
          view: {
            title: "Get trusted by the owner",
            description: `Let the owner of the location scan the barcode below to get trusted`,
            submitButtonText: "Verify me",
          },
          html: () => "",
          hideNav: true,
        },
        navigation: {
          previous: "#info",
          canGoBack: () => true,
          next: "#success",
        },
      }),
      proofUniqueness: prompt({
        id: "proofUniqueness",
        field: "__",
        component: HtmlViewer,
        params: {
          view: {
            title: "Proof you're unique",
            description: `For Circles to work it's important that everybody uses only one account.
                          <p class="mt-1"><b>Upload a short selfie video to immediately proof the uniqueness of your account.</b></p>`,
            submitButtonText: "Use biometrics",
          },
          html: () => "",
          hideNav: false,
        },
        navigation: {
          previous: "#info",
          canGoBack: () => true,
          next: "#performOAuth",
        },
      }),
      performOAuth: {
        id: "performOAuth",
        entry: () => window.o.runProcess(performOauth, {
          origin: "locations"
        })
      },
      success: {
        type: "final",
        id: "success",
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
        data: (context, event: any) => {
          return "yeah!";
        },
      },
    }
  });

export const getTrustedByShop: ProcessDefinition<
  void,
  GetTrustedByShopContext
  > = {
  name: "getTrustedByShop",
  stateMachine: <any>processDefinition,
};
