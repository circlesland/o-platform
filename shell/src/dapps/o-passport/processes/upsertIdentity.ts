import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import * as yup from "yup";
import { promptChoice } from "./identify/prompts/promptChoice";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";
import { promptFile } from "../../../shared/api/promptFile";
import { promptCity } from "../../../shared/api/promptCity";
import {City, UpsertProfileDocument} from "../../../shared/api/data/types";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

export type UpsertIdentityContextData = {
  id?: number;
  newsletter?: boolean;
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
  successAction?: (data:UpsertIdentityContextData) => void;
};

export type UpsertIdentityContext = ProcessContext<UpsertIdentityContextData>;

const editorContent: { [x: string]: EditorViewContext } = {
  firstName: {
    title: "What is your first name?",
    description:
      "Welcome, you are finally a citizen of CirclesLand. Glad to have you here.",
    placeholder: "First name",
    submitButtonText: "Save",
  },
  lastName: {
    title: "What is your last name?",
    description:
      "Display your full name in your profile to become more trust worthy.",
    placeholder: "Last name",
    submitButtonText: "Save",
  },
  dream: {
    title: "Share your passion",
    description:
      "What will you do, create, build or offer to grow the basic income economy and accept Circles as payment for it?",
    placeholder: "Your passion",
    submitButtonText: "Start growing",
    maxLength: "150",
  },
  city: {
    title: "Vote for your City",
    description:
      "Advance your city in the basic income ranking and push the political discourse in your area.",
    placeholder: "Last name",
    submitButtonText: "Submit vote",
  },
  imageView: {
    title: "Profile Image",
    description: "Show the World who you are",
    placeholder: "Upload Image",
    submitButtonText: "Upload Image",
  },
  newsletter: {
    title: "Newsletter",
    description:
      "Do you want to subscribe to our monthly newsletter to stay up to date with the developments around the basic income economy?",
    placeholder: "",
    submitButtonText: "",
  },
};

const processDefinition = (processId: string, skipIfNotDirty?: boolean) =>
  createMachine<UpsertIdentityContext, any>({
    id: `${processId}:upsertIdentity`,
    initial: "firstName",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UpsertIdentityContext, any>("error"),

      firstName: prompt<UpsertIdentityContext, any>({
        field: "firstName",
        onlyWhenDirty: skipIfNotDirty,
        component: TextEditor,
        params: {
          view: editorContent.firstName,
        },
        dataSchema: yup.string().required("Please enter your first name."),
        navigation: {
          next: "#lastName",
        },
      }),
      lastName: prompt<UpsertIdentityContext, any>({
        field: "lastName",
        onlyWhenDirty: skipIfNotDirty,
        component: TextEditor,
        params: {
          view: editorContent.lastName,
        },
        navigation: {
          next: "#country",
          previous: "#firstName",
          canSkip: () => true,
        },
      }),
      country: promptCity<UpsertIdentityContext, any>({
        id: "country",
        field: "cityGeonameid",
        onlyWhenDirty: skipIfNotDirty,
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
        onlyWhenDirty: skipIfNotDirty,
        component: TextareaEditor,
        params: { view: editorContent.dream },
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
      avatarUrl: promptFile<UpsertIdentityContext, any>({
        field: "avatarUrl",
        onlyWhenDirty: skipIfNotDirty,
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
        onlyWhenDirty: skipIfNotDirty,
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

            if (!context.data.circlesSafeOwner
              && sessionStorage.getItem("circlesKey")) {
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
                circlesSafeOwner: safeOwnerAddress,
                firstName: context.data.firstName,
                lastName: context.data.lastName,
                dream: context.data.dream,
                newsletter: context.data.newsletter ?? false,
                country: context.data.country,
                avatarUrl: context.data.avatarUrl,
                avatarMimeType: context.data.avatarMimeType,
                cityGeonameid: context.data.cityGeonameid,
                status: "",
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

export const upsertIdentityOnlyWhereDirty = {
  id: upsertIdentity.id,
  name: upsertIdentity.name,
  stateMachine: (processId?: string) =>
    (<any>upsertIdentity).stateMachine(processId, true),
};
