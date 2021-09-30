import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { createMachine } from "xstate";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { promptChoice } from "../../o-passport/processes/identify/prompts/promptChoice";
import ButtonStackSelector from "@o-platform/o-editors/src/ButtonStackSelector.svelte";
import { fromCirclesLand } from "./fromCirclesLand";
import { identify } from "../../o-passport/processes/identify/identify";

export type OnboardingMenuContextData = {
  chooseFlow?: {
    key: string;
    label: string;
  };
};

export type OnboardingMenuContext = ProcessContext<OnboardingMenuContextData>;

const processDefinition = (processId: string) =>
  createMachine<OnboardingMenuContext, any>({
    id: `${processId}:fromCirclesLand`,
    initial: "chooseFlow",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<OnboardingMenuContext, any>("error"),

      chooseFlow: promptChoice({
        id: "chooseFlow",
        component: ButtonStackSelector,
        entry: () => console.log("chooseFlow"),
        params: {
          view: {
            title: "Please choose a sign-in option:",
            description: "Hello World",
            placeholder: "",
            submitButtonText: "",
          },
        },
        options: [
          {
            key: "google",
            label: "Sign in with Google",
            target: "#google",
            class: "btn-light",
            icon: "google",
          },
          {
            key: "apple",
            label: "Sign in with Apple",
            target: "#apple",
            class: "btn-light",
            icon: "apple",
          },
          {
            key: "email",
            label: "Sign in with Email",
            target: "#email",
            class: "btn-primary",
            icon: "email",
          },
        ],
      }),

      google: {
        id: "google",
        type: "final",
        entry: () => {
          window.o.runProcess(identify, {});
        },
      },
      apple: {
        id: "apple",
        type: "final",
        entry: () => {
          window.o.runProcess(identify, {});
        },
      },
      email: {
        id: "email",
        type: "final",
        entry: () => {
          window.o.runProcess(fromCirclesLand, {});
        },
      },
    },
  });

export const onboardingMenu: ProcessDefinition<void, OnboardingMenuContext> = {
  name: "onboardingMenu",
  stateMachine: <any>processDefinition,
};
