import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import EmailAddressEditor from "@o-platform/o-editors/src/EmailAddressEditor.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import * as yup from "yup";
import { promptChoice } from "./identify/prompts/promptChoice";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";
import { City, DisplayCurrency, UpsertProfileDocument } from "../../../shared/api/data/types";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { UpsertRegistrationContext } from "../../o-onboarding/processes/registration/promptRegistration";

export type UpsertIdentityContextData = {
  id?: number;
  newsletter?: boolean;
  displayTimeCircles?: boolean;
  displayCurrency?: DisplayCurrency;
  circlesAddress?: string;
  circlesSafeOwner?: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  askedForEmailAddress?: boolean;
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
    title: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.title"),
    description: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.description"),
    placeholder: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.placeholder"),
    submitButtonText: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.submitButtonText"),
  },
  emailAddress: {
    title: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.title"),
    description: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.description"),
    placeholder: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.placeholder"),
    submitButtonText: window.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.submitButtonText"
    ),
  },
  newsletter: {
    title: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.title"),
    description: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.description"),
    placeholder: "",
    submitButtonText: "",
  },
};

const processDefinition = (processId: string) =>
  createMachine<UpsertIdentityContext, any>({
    id: `${processId}:upsertIdentity`,
    initial: "emailAddress",

    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UpsertIdentityContext, any>("error"),

      emailAddress: prompt<UpsertIdentityContext, any>({
        id: "emailAddress",
        field: "emailAddress",
        component: EmailAddressEditor,
        params: {
          view: editorContent.emailAddress = {
            title: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.title"),
            description: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.description"),
            placeholder: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.placeholder"),
            submitButtonText: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.submitButtonText"),
          },
        },
        navigation: {
          canSkip: () => true,
          canGoBack: () => false,
          skip: "#firstName",
          next: [
            {
              cond: (context) => !!context.data.emailAddress && context.data.emailAddress.trim() != "",
              target: "#newsletter",
            },
            {
              target: "#firstName",
            },
          ],
        },
      }),

      newsletter: promptChoice<UpsertRegistrationContext, any>({
        id: "newsletter",
        component: ChoiceSelector,
        params: { view: editorContent.newsletter = {
          title: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.title"),
          description: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.description"),
          placeholder: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.placeholder"),
          submitButtonText: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.submitButtonText"),
        }},
        options: [
          {
            key: "dontSubscribe",
            label: "No thanks",
            target: "#firstName",
            class: "btn btn-outline",
            action: (context) => {
              context.data.newsletter = false;
            },
          },
          {
            key: "subscribe",
            label: "Yes please",
            target: "#firstName",
            class: "btn btn-outline",
            action: (context) => {
              context.data.newsletter = true;
            },
          },
        ],
        navigation: {
          canGoBack: () => true,
          previous: "#emailAddress",
          canSkip: () => false,
          skip: "#firstName",
        },
      }),

      firstName: prompt<UpsertIdentityContext, any>({
        field: "firstName",
        component: TextEditor,
        params: {
          view: editorContent.firstName = {
            title: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.title"),
            description: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.description"),
            placeholder: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.placeholder"),
            submitButtonText: window.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.submitButtonText"),
          },
        },
        dataSchema: yup.string().required(window.i18n("dapps.o-passport.processes.upsertIdentity.requiredName")),
        navigation: {
          canGoBack: () => true,
          previous: "#newsletter",
          next: "#upsertIdentity",
        },
      }),

      upsertIdentity: {
        id: "upsertIdentity",
        invoke: {
          src: async (context) => {
            if (!context.data.circlesSafeOwner && sessionStorage.getItem("circlesKey")) {
              localStorage.removeItem("circlesKey");
            }

            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const safeOwnerAddress =
              context.data.circlesSafeOwner ??
              (sessionStorage.getItem("circlesKey")
                ? RpcGateway.get().eth.accounts.privateKeyToAccount(sessionStorage.getItem("circlesKey")).address
                : undefined);
            const result = await apiClient.mutate({
              mutation: UpsertProfileDocument,
              variables: {
                id: context.data.id,
                circlesAddress: context.data.circlesAddress,
                circlesSafeOwner: safeOwnerAddress.toLowerCase(),
                firstName: context.data.firstName,
                lastName: context.data.lastName,
                emailAddress: context.data.emailAddress,
                askedForEmailAddress: true,
                // dream: context.data.dream,
                newsletter: context.data.newsletter,
                displayTimeCircles: context.data.displayTimeCircles ?? true,
                country: context.data.country,
                avatarUrl: context.data.avatarUrl,
                avatarMimeType: context.data.avatarMimeType,
                cityGeonameid: context.data.cityGeonameid,
                status: "",
                displayCurrency: context.data.displayCurrency,
              },
            });
            sessionStorage.setItem("askedForEmailAddress", "true");
            return result.data.upsertProfile;
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        type: "final",
        id: "success",
        entry: (context, event) => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.authenticated",
            profile: event.data
          });
          if (context.data.successAction) {
            context.data.successAction(context.data);
          }
        },
        data: (context, event: any) => {
          return event.data;
        },
      },
    },
  });


export const upsertIdentityShort: ProcessDefinition<void, UpsertIdentityContextData> = {
  name: "upsertIdentityShort",
  stateMachine: <any>processDefinition,
};
