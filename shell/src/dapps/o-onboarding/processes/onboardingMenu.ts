import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {createMachine} from "xstate";
import {fatalError} from "@o-platform/o-process/dist/states/fatalError";
import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {promptChoice} from "../../o-passport/processes/identify/prompts/promptChoice";
import {fromCirclesLand} from "./fromCirclesLand";
import {identify} from "../../o-passport/processes/identify/identify";

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
        entry: () => console.log("chooseFlow"),
        params: {
          view: {
            title: "Please choose a sign-in option:",
            description: "Hello World",
            placeholder: "",
            submitButtonText: "",
          }
        },
        options: [
          {
            key: "signup",
            label: "Signup",
            target: "#signup",
          },
          {
            key: "login",
            label: "Login",
            target: "#login",
          },
          {
            key: "fromCirclesLand",
            label: "fromCirclesLand",
            target: "#fromCirclesLand",
          }
        ],
      }),

      signup: {
        id: "signup",
        type: "final",
        entry: () => {
          window.o.runProcess(identify, {});
        }
      },
      login: {
        id: "login",
        type: "final",
        entry: () => {
          window.o.runProcess(identify, {});
        }
      },
      fromCirclesLand: {
        id: "fromCirclesLand",
        type: "final",
        entry: () => {
          window.o.runProcess(fromCirclesLand, {});
        }
      }
    },
  });

export const onboardingMenu: ProcessDefinition<void, OnboardingMenuContext> = {
  name: "onboardingMenu",
  stateMachine: <any>processDefinition,
};