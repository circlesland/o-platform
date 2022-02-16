import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {show} from "@o-platform/o-process/dist/actions/show";
import Profile from "../molecules/Profile.svelte";

export type ShowProfileContextData = {
  id: string;
};

export type ShowProfileContext = ProcessContext<ShowProfileContextData>;

const processDefinition = (processId: string) =>
  createMachine<ShowProfileContext, any>({
    id: `${processId}:showProfile`,
    initial: "showProfile",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<ShowProfileContext, any>("error"),

      showProfile: {
        id: "showProfile",
        entry: <any>show({
          field: "__",
          component: Profile,
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
          return window.i18n("dapps.o-banking.processes.showProfile.success.return");
        },
      },
    },
  });

export const showProfile: ProcessDefinition<void, ShowProfileContext> = {
  name: "showProfile",
  stateMachine: <any>processDefinition,
};
