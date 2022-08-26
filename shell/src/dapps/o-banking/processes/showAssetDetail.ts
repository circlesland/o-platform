import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {show} from "@o-platform/o-process/dist/actions/show";
import AssetDetail from "../pages/AssetDetail.svelte";

export type ShowAssetDetailContextData = {
  id: string;
};

export type ShowAssetDetailContext = ProcessContext<ShowAssetDetailContextData>;

const processDefinition = (processId: string) =>
  createMachine<ShowAssetDetailContext, any>({
    id: `${processId}:showAssetDetail`,
    initial: "showAssetDetail",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<ShowAssetDetailContext, any>("error"),

      showAssetDetail: {
        id: "showAssetDetail",
        entry: <any>show({
          field: "__",
          component: AssetDetail,
          params: (context) => {
            return {
              id: context.data.id
            }
          },
          navigation: {
            canGoBack: () => false,
            canSkip: () => false,
            next: "#success"
          }
        })
      },
      success: {
        type: "final",
        id: "success",
        data: (context, event: PlatformEvent) => {
          return window.o.i18n("dapps.o-banking.processes.showAssetDetail.success.return");
        },
      },
    },
  });

export const showAssetDetail: ProcessDefinition<void, ShowAssetDetailContext> = {
  name: "showAssetDetail",
  stateMachine: <any>processDefinition,
};
