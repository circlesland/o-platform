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
          label: window.i18n("dapps.o-marketplace.processes.getTrustedByShop.options.getTrusted.label")
        }, {
          key: "proofUniqueness",
          target: "#proofUniqueness",
          label: window.i18n("dapps.o-marketplace.processes.getTrustedByShop.options.proofUniqueness.label")
        }],
        params: {
          view: {
            title: window.i18n("dapps.o-marketplace.processes.getTrustedByShop.params.title"),
            description: window.i18n("dapps.o-marketplace.processes.getTrustedByShop.params.description")
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
            title: window.i18n("dapps.o-marketplace.processes.getTrustedByShop.getTrusted.params.title"),
            description: window.i18n("dapps.o-marketplace.processes.getTrustedByShop.getTrusted.params.description"),
            submitButtonText: window.i18n("dapps.o-marketplace.processes.getTrustedByShop.getTrusted.params.submitButtonText"),
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
            title: window.i18n("dapps.o-marketplace.processes.getTrustedByShop.proofUniqueness.params.title"),
            description: window.i18n("dapps.o-marketplace.processes.getTrustedByShop.proofUniqueness.params.description"),
            submitButtonText: window.i18n("dapps.o-marketplace.processes.getTrustedByShop.proofUniqueness.params.submitButtonText"),
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
