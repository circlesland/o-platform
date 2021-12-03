import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import {show} from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import {AddMemberDocument} from "../../../shared/api/data/types";
import {promptCirclesSafe} from "../../../shared/api/promptCirclesSafe";

export type AddMemberContextData = {
  successAction: (data:AddMemberContextData) => void,
  groupId?: number;
  memberAddress?: string;
};

export type AddMemberContext = ProcessContext<AddMemberContextData>;

const processDefinition = (processId: string) =>
  createMachine<AddMemberContext, any>({
    id: `${processId}:addMember`,
    initial: "memberAddress",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<AddMemberContext, any>("error"),

      memberAddress: promptCirclesSafe<AddMemberContext, any>({
        field: "memberAddress",
        onlyWhenDirty: false,
        params: {
          view: {
            title: "Select the person you want to add",
            description: "",
            placeholder: "Select",
            submitButtonText: "Add",
          },
          placeholder: "Select",
          submitButtonText: "Add",
        },
        navigation: {
          next: "#addMember",
        },
      }),
      addMember: {
        id: "addMember",
        invoke: {
          src: async (context) => {
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: AddMemberDocument,
              variables: {
                groupId: context.data.groupId,
                memberAddress: context.data.memberAddress
              },
            });
          },
          onDone: "success",
          onError: {
            actions: (context, event) => {
              window.o.lastError = event.data;
            },
            target: "#showError",
          },
        }
      },
      showError: {
        id: "showError",
        entry: show({
          component: ErrorView,
          params: {},
          field: {
            name: "",
            get: () => undefined,
            set: (o: any) => {},
          },
        }),
      },
      success: {
        type: "final",
        id: "success",
        entry: (context) => {
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        }
      },
    },
  });

export const verify: ProcessDefinition<void, AddMemberContext> = {
  name: "addMember",
  stateMachine: <any>processDefinition,
};
