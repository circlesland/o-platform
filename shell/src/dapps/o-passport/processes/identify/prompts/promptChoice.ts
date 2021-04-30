import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";

export type PromptChoiceSpec = {
  id: string
  promptLabel: string
  options:{key:string, label:string, target:string}[]
};

export function promptChoice<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
  >(spec: PromptChoiceSpec) {
  const connectOrCreateConfig: any = {
    // TODO: Fix need for 'any'
    id: spec.id,
    initial: "promptChoice",
    states: {
      promptChoice: prompt<ProcessContext<any>, any>({
        fieldName: spec.id,
        component: ChoiceSelector,
        params: {
          label: spec.promptLabel,
          choices: spec.options
        },
        navigation: {
          next: "#checkChoiceAndContinue",
        },
      }),
      checkChoiceAndContinue: {
        id: "checkChoiceAndContinue",
        always: spec.options.map(c => {
          return {
            cond: (context) => {
              return context.data[spec.id].key == c.key
            },
            target: c.target,
          }
        })
      },
    }
  };

  return connectOrCreateConfig;
}
