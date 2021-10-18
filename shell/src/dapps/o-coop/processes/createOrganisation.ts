import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import * as yup from "yup";
import { promptFile } from "../../../shared/api/promptFile";
import { promptCity } from "../../../shared/api/promptCity";

export type CreateOrganisationContextData = {
  successAction: (data:CreateOrganisationContextData) => void
};

export type CreateOrganisationContext = ProcessContext<CreateOrganisationContextData>;

const processDefinition = (processId: string) =>
  createMachine<CreateOrganisationContext, any>({
    id: `${processId}:upsertIdentity`,
    initial: "name",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<CreateOrganisationContext, any>("error"),

      name: prompt<CreateOrganisationContext, any>({
        id: "name",
        field: "firstName",
        component: TextEditor,
        params: {
          view: {
            title: "What is the name of your organisation?",
            description: "DESCRIPTION",
            placeholder: "Name",
            submitButtonText: "Save",
          },
        },
        dataSchema: yup.string().required("Please enter an organisation name."),
        navigation: {
          next: "#country",
        },
      }),
      country: promptCity<CreateOrganisationContext, any>({
        id: "country",
        field: "cityGeonameid",
        params: {
          view: {
            title: "Where is your organisation located?",
            description: "DESCRIPTION",
            placeholder: "City",
            submitButtonText: "Save",
          }
        },
        navigation: {
          next: "#dream",
          previous: "#name",
          canSkip: () => true,
        },
      }),
      dream: prompt<CreateOrganisationContext, any>({
        field: "dream",
        component: TextareaEditor,
        params: {
          view: {
            title: "Describe your organisation in a few sentences?",
            description: "DESCRIPTION",
            placeholder: "Description",
            submitButtonText: "Save",
          }
        },
        dataSchema: yup
          .string()
          .nullable()
          .notRequired()
          .max(150, "The maximum amount of characters allowed is 150."),
        navigation: {
          next: "#avatarUrl",
          canSkip: () => true,
          previous: "#country",
        },
      }),
      avatarUrl: promptFile<CreateOrganisationContext, any>({
        field: "avatarUrl",
        uploaded: (context, event) => {
          //context.data.avatarUrl = event.data?.url;
          //context.data.avatarMimeType = event.data?.mimeType;
        },
        params: {
          view: {
            title: "Profile Image",
            description: "Show the World who you are",
            placeholder: "Upload Image",
            submitButtonText: "Upload Image",
          },
        },
        navigation: {
          next: "#upsertOrganisation",
          previous: "#dream",
          canSkip: () => true,
        },
      }),
      upsertOrganisation: {
        id: "upsertOrganisation",
        invoke: {
          src: async (context) => {
            // return result.data.upsertProfile;
          },
          onDone: "#success",
          onError: "#error",
        },
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
          //console.log(`enter: upsertIdentity.success`, context.data);
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.authenticated",
            profile: event.data,
          });
          return event.data;
        },
      },
    },
  });

export const createOrganisation: ProcessDefinition<void, CreateOrganisationContext> = {
  name: "createOrganisation",
  stateMachine: <any>processDefinition,
};
