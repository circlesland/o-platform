import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {createMachine} from "xstate";
import QrCodeViewer from "@o-platform/o-editors/src/QrCodeViewer.svelte";
import {me} from "../../../shared/stores/me";

export type GetTrustedByShopContextData = {
  successAction?: (data: GetTrustedByShopContextData) => void;
};

export type GetTrustedContext = ProcessContext<GetTrustedByShopContextData>;

const processDefinition = (processId: string) =>
  createMachine<GetTrustedContext, any>({
    id: `${processId}:getTrusted`,
    initial: "getTrusted",
    states: {
      ...fatalError<GetTrustedContext, any>("error"),
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
          canGoBack: () => false,
          next: "#success"
        },
      }),
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

export const getTrusted: ProcessDefinition<
  void,
  GetTrustedContext
  > = {
  name: "getTrusted",
  stateMachine: <any>processDefinition,
};
