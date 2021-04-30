import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";

export type CoonnectOrCreateSpec = {
  id: string
  promptLabel: string
  connectLabel: string
  onConnect: string
  createLabel: string
  onCreate: string
};

export function connectOrCreate<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
  >(spec: CoonnectOrCreateSpec) {
  const connectOrCreateConfig: any = {
    // TODO: Fix need for 'any'
    id: spec.id,
    initial: "connectOrCreate",
    states: {
      connectOrCreate: prompt<ProcessContext<any>, any>({
        fieldName: spec.id + "_field",
        component: ChoiceSelector,
        params: {
          label: spec.promptLabel,
          choices: [{
            key: "createProfile",
            label: spec.createLabel
          }, {
            key: "connectProfile",
            label: spec.connectLabel
          }]
        },
        navigation: {
          next: "#checkChoice",
        },
      }),
      checkChoice: {
        id: "checkChoice",
        always: [
          {
            cond: (context) => {
              return context.data[spec.id + "_field"].key == "createProfile"
            },
            target: spec.onCreate,
          },
          {
            cond: (context) => {
              return context.data[spec.id + "_field"].key == "connectProfile"
            },
            target: spec.onConnect,
          },
        ],
      },
    }
  };

  return connectOrCreateConfig;
}
