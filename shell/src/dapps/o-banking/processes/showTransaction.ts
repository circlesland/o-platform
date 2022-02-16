import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {show} from "@o-platform/o-process/dist/actions/show";
import TransactionDetail from "../pages/TransactionDetail.svelte";

export type ShowTransactionContextData = {
  id: string;
};

export type ShowTransactionContext = ProcessContext<ShowTransactionContextData>;

const processDefinition = (processId: string) =>
  createMachine<ShowTransactionContext, any>({
    id: `${processId}:showTransaction`,
    initial: "showTransaction",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<ShowTransactionContext, any>("error"),

      showTransaction: {
        id: "showTransaction",
        entry: <any>show({
          field: "__",
          component: TransactionDetail,
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
          return window.i18n("dapps.o-banking.processes.showTransaction.success.return");
        },
      },
    },
  });

export const showTransaction: ProcessDefinition<void, ShowTransactionContext> = {
  name: "showTransaction",
  stateMachine: <any>processDefinition,
};
