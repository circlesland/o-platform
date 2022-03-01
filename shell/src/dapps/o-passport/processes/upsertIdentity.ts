import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import EmailAddressEditor from "@o-platform/o-editors/src/EmailAddressEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import * as yup from "yup";
import { promptChoice } from "./identify/prompts/promptChoice";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";
import { promptFile } from "../../../shared/api/promptFile";
import { promptCity } from "../../../shared/api/promptCity";
import {
  City,
  DisplayCurrency,
  UpsertProfileDocument,
} from "../../../shared/api/data/types";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";

export type UpsertIdentityContextData = {
  id?: number;
  newsletter?: boolean;
  displayTimeCircles?: boolean;
  displayCurrency?: DisplayCurrency;
  circlesAddress?: string;
  circlesSafeOwner?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  dream?: string;
  cityGeonameid?: number;
  city?: City;
  avatarUrl?: string;
  avatarMimeType?: string;
  successAction?: (data: UpsertIdentityContextData) => void;
};

export type UpsertIdentityContext = ProcessContext<UpsertIdentityContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  firstName: {
    title: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.firstName.title"
    ),
    description: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.firstName.description"
    ),
    placeholder: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.firstName.placeholder"
    ),
    submitButtonText: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.firstName.submitButtonText"
    ),
  },
  lastName: {
    title: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.lastName.title"
    ),
    description: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.lastName.description"
    ),
    placeholder: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.lastName.placeholder"
    ),
    submitButtonText: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.lastName.submitButtonText"
    ),
  },
  emailAddress: {
    title: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.title"
    ),
    description: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.description"
    ),
    placeholder: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.placeholder"
    ),
    submitButtonText: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.submitButtonText"
    ),
  },
  dream: {
    title: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.dream.title"
    ),
    description: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.dream.description"
    ),
    placeholder: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.dream.placeholder"
    ),
    submitButtonText: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.dream.submitButtonText"
    ),
    maxLength: "150",
  },
  city: {
    title: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.city.title"
    ),
    description: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.city.description"
    ),
    placeholder: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.city.placeholder"
    ),
    submitButtonText: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.city.submitButtonText"
    ),
  },
  imageView: {
    title: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.imageView.title"
    ),
    description: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.imageView.description"
    ),
    placeholder: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.imageView.placeholder"
    ),
    submitButtonText: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.imageView.submitButtonText"
    ),
  },
  newsletter: {
    title: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.title"
    ),
    description: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.description"
    ),
    placeholder: "",
    submitButtonText: "",
  },
};

const processDefinition = (processId: string) =>
  createMachine<UpsertIdentityContext, any>({
    id: `${processId}:upsertIdentity`,
    initial: "firstName",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UpsertIdentityContext, any>("error"),

      firstName: prompt<UpsertIdentityContext, any>({
        field: "firstName",
        component: TextEditor,
        params: {
          view: editorContent.firstName,
        },
        dataSchema: yup
          .string()
          .required(
            window.i18n(
              "dapps.o-passport.processes.upsertIdentity.requiredName"
            )
          ),
        navigation: {
          next: "#lastName",
        },
      }),
      lastName: prompt<UpsertIdentityContext, any>({
        field: "lastName",
        component: TextEditor,
        params: {
          view: editorContent.lastName,
        },
        navigation: {
          next: "#emailAddress",
          previous: "#firstName",
          canSkip: () => true,
        },
      }),
      emailAddress: prompt<UpsertIdentityContext, any>({
        field: "emailAddress",
        component: EmailAddressEditor,
        params: {
          view: editorContent.emailAddress,
        },
        navigation: {
          next: "#country",
          previous: "#lastName",
          canSkip: () => true,
        },
      }),
      country: promptCity<UpsertIdentityContext, any>({
        id: "country",
        field: "cityGeonameid",
        params: {
          view: editorContent.city,
        },
        navigation: {
          next: "#dream",
          previous: "#lastName",
          canSkip: () => true,
        },
      }),
      dream: prompt<UpsertIdentityContext, any>({
        field: "dream",
        component: TextareaEditor,
        params: { view: editorContent.dream },
        dataSchema: yup
          .string()
          .nullable()
          .notRequired()
          .max(
            150,
            window.i18n(
              "dapps.o-passport.processes.upsertIdentity.maximumChars"
            )
          ),
        navigation: {
          next: "#avatarUrl",
          canSkip: () => true,
          previous: "#country",
        },
      }),
      avatarUrl: promptFile<UpsertIdentityContext, any>({
        field: "avatarUrl",
        uploaded: (context, event) => {
          context.data.avatarUrl = event.data?.url;
          context.data.avatarMimeType = event.data?.mimeType;
        },
        params: {
          view: editorContent.imageView,
        },
        navigation: {
          next: "#upsertIdentity",
          previous: "#dream",
          canSkip: () => true,
        },
      }),
      /*
      newsletter: promptChoice<UpsertIdentityContext, any>({
        id: "newsletter",
        component: ChoiceSelector,
        params: { view: editorContent.newsletter },
        options: [
          {
            key: "dontSubscribe",
            label: "No thanks",
            target: "#upsertIdentity",
            action: (context) => {
              context.data.newsletter = false;
            },
          },
          {
            key: "subscribe",
            label: "Yes please",
            target: "#upsertIdentity",
            action: (context) => {
              context.data.newsletter = true;
            },
          },
        ],
        navigation: {
          canGoBack: () => true,
          previous: "#avatarUrl",
          skip: "#upsertIdentity",
        },
      }),
       */
      upsertIdentity: {
        id: "upsertIdentity",
        invoke: {
          src: async (context) => {
            if (
              !context.data.circlesSafeOwner &&
              sessionStorage.getItem("circlesKey")
            ) {
              localStorage.removeItem("circlesKey");
            }

            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const safeOwnerAddress =
              context.data.circlesSafeOwner ??
              (sessionStorage.getItem("circlesKey")
                ? RpcGateway.get().eth.accounts.privateKeyToAccount(
                    sessionStorage.getItem("circlesKey")
                  ).address
                : undefined);
            const result = await apiClient.mutate({
              mutation: UpsertProfileDocument,
              variables: {
                id: context.data.id,
                circlesAddress: context.data.circlesAddress,
                circlesSafeOwner: safeOwnerAddress.toLowerCase(),
                firstName: context.data.firstName,
                lastName: context.data.lastName,
                dream: context.data.dream,
                newsletter: context.data.newsletter ?? false,
                displayTimeCircles: context.data.displayTimeCircles ?? true,
                country: context.data.country,
                avatarUrl: context.data.avatarUrl,
                avatarMimeType: context.data.avatarMimeType,
                cityGeonameid: context.data.cityGeonameid,
                status: "",
                displayCurrency: context.data.displayCurrency,
              },
            });
            return result.data.upsertProfile;
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

export const upsertIdentity: ProcessDefinition<
  void,
  UpsertIdentityContextData
> = {
  name: "upsertIdentity",
  stateMachine: <any>processDefinition,
};
