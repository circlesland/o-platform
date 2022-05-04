import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import * as yup from "yup";
import { promptFile } from "../../../shared/api/promptFile";
import { promptCity } from "../../../shared/api/promptCity";
import {UpsertOrganisationDocument} from "../../../shared/api/data/types";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {show} from "@o-platform/o-process/dist/actions/show";
import ErrorView from "../../../shared/atoms/Error.svelte";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {setWindowLastError} from "../../../shared/processes/actions/setWindowLastError";

export type CreateOrganisationContextData = {
  successAction: (data:CreateOrganisationContextData) => void,
  id: number|undefined,
  avatarMimeType: "image/png",
  avatarUrl: string,
  circlesAddress: string,
  cityGeonameid: string,
  description: string,
  name: string,
  displayName: string,
  organisationSafeProxy: GnosisSafeProxy
};

export type CreateOrganisationContext = ProcessContext<CreateOrganisationContextData>;


const processDefinition = (processId: string) =>
  createMachine<CreateOrganisationContext, any>({
    id: `${processId}:upsertOrganisation`,
    initial: "name",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<CreateOrganisationContext, any>("error"),

      name: prompt<CreateOrganisationContext, any>({
        id: "name",
        field: "name",
        component: TextEditor,
        params: {
          view: {
            title: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.title"),
            description: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.description"),
            placeholder: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.placeholder"),
            submitButtonText: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.submitButtonText"),
          },
        },
        dataSchema: yup.string().required(window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.name.enterOrganisationName")),
        navigation: {
          next: "#country",
        },
      }),
      country: promptCity<CreateOrganisationContext, any>({
        id: "country",
        field: "cityGeonameid",
        params: {
          view: {
            title: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.country.title"),
            description: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.country.description"),
            placeholder: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.country.placeholder"),
            submitButtonText: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.country.submitButtonText"),
          }
        },
        navigation: {
          next: "#description",
          previous: "#name",
          canSkip: () => true,
        },
      }),
      description: prompt<CreateOrganisationContext, any>({
        field: "description",
        component: TextareaEditor,
        params: {
          view: {
            title: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.title"),
            description: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.description"),
            placeholder: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.placeholder"),
            submitButtonText: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.submitButtonText"),
          }
        },
        dataSchema: yup
          .string()
          .nullable()
          .notRequired()
          .max(150, window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.description.maximumChars")),
        navigation: {
          next: "#avatarUrl",
          canSkip: () => true,
          previous: "#country",
        },
      }),
      avatarUrl: promptFile<CreateOrganisationContext, any>({
        field: "avatarUrl",
        uploaded: (context, event) => {
          context.data.avatarUrl = event.data?.url;
        },
        params: {
          view: {
            title: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.title"),
            description: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.description"),
            placeholder: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.placeholder"),
            submitButtonText: window.i18n("dapps.o-coop.processes.createOrganisations.createOrganisationContext.avatar.submitButtonText"),
          },
        },
        navigation: {
          next: "#upsertOrganisation",
          previous: "#description",
          canSkip: () => true
        },
      }),
      upsertOrganisation: {
        id: "upsertOrganisation",
        entry: () => console.log(`upsertOrganisation ...`),
        invoke: {
          src: async (context) => {
            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: UpsertOrganisationDocument,
              variables: {
                organisation: {
                  id: context.data.id,
                  avatarMimeType: context.data.avatarMimeType,
                  avatarUrl: context.data.avatarUrl,
                  circlesAddress: context.data.circlesAddress.toLowerCase(),
                  cityGeonameid: context.data.cityGeonameid,
                  description: context.data.description,
                  name: context.data.name
                }
              }
            });
            context.data.displayName = context.data.name;
            context.data = {
              ...context.data,
              ...result.data.upsertOrganisation.organisation
            };
          },
          onDone: "#success",
          onError: {
            actions: setWindowLastError,
            target: "#showError",
          },
        },
      },
      showError: {
        id: "showError",
        entry: show({
          // TODO: fix <any> cast
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
        },
        data: (context, event: any) => {
          return context.data;
        },
      }
    },
  });

export const upsertOrganisation: ProcessDefinition<void, CreateOrganisationContext> = {
  name: "upsertOrganisation",
  stateMachine: <any>processDefinition,
};
