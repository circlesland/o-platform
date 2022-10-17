import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import HtmlViewer from "@o-platform/o-editors/src/HtmlViewer.svelte";
import EmailAddressEditor from "@o-platform/o-editors/src/EmailAddressEditor.svelte";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import * as yup from "yup";
import { promptChoice } from "./identify/prompts/promptChoice";
import ChoiceSelector from "@o-platform/o-editors/src/ChoiceSelector.svelte";
import { promptFile } from "../../../shared/api/promptFile";
import { promptCity } from "../../../shared/api/promptCity";
import { City, DisplayCurrency, UpsertProfileDocument } from "../../../shared/api/data/types";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { UpsertRegistrationContext } from "../../o-onboarding/processes/registration/promptRegistration";
import LocationSearchEditor from "@o-platform/o-editors/src/LocationSearchEditor.svelte";

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
  /*
  info: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.info.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.info.description"),
    submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.info.submitButtonText"),
  },
   */
  firstName: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.placeholder"),
    submitButtonText: window.o.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.firstName.submitButtonText"
    ),
  },
  lastName: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.placeholder"),
    submitButtonText: window.o.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.lastName.submitButtonText"
    ),
  },
  emailAddress: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.placeholder"),
    submitButtonText: window.o.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.submitButtonText"
    ),
  },
  city: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.placeholder"),
    submitButtonText: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.submitButtonText"),
  },
  imageView: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.description"),
    placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.placeholder"),
    submitButtonText: window.o.i18n(
      "dapps.o-passport.processes.upsertIdentity.editorContent.imageView.submitButtonText"
    ),
  },
  newsletter: {
    title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.title"),
    description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.description"),
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

      /*
      info: prompt({
        id: "info",
        field: "info",
        component: HtmlViewer,
        params: {
          view: editorContent.info,
          html: () => "",
          hideNav: false,
        },
        navigation: {
          canSkip: () => false,
          canGoBack: () => false,
          next: "#emailAddress",
        },
      }),

 */

      emailAddress: prompt<UpsertIdentityContext, any>({
        id: "emailAddress",
        field: "emailAddress",
        component: EmailAddressEditor,
        params: {
          view: (editorContent.emailAddress = {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.title"),
            description: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.description"
            ),
            placeholder: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.placeholder"
            ),
            submitButtonText: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.emailAddress.submitButtonText"
            ),
          }),
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
        params: {
          view: (editorContent.newsletter = {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.title"),
            description: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.newsletter.description"
            ),
            placeholder: "",
            submitButtonText: "",
          }),
        },
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
          view: (editorContent.firstName = {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.title"),
            description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.description"),
            placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.firstName.placeholder"),
            submitButtonText: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.firstName.submitButtonText"
            ),
          }),
        },
        dataSchema: yup.string().required(window.o.i18n("dapps.o-passport.processes.upsertIdentity.requiredName")),
        navigation: {
          canGoBack: () => true,
          previous: "#newsletter",
          next: "#lastName",
        },
      }),

      lastName: prompt<UpsertIdentityContext, any>({
        field: "lastName",
        component: TextEditor,
        params: {
          view: (editorContent.lastName = {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.title"),
            description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.description"),
            placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.lastName.placeholder"),
            submitButtonText: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.lastName.submitButtonText"
            ),
          }),
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
        params: {
          view: (editorContent.city = {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.title"),
            description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.description"),
            placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.city.placeholder"),
            submitButtonText: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.city.submitButtonText"
            ),
          }),
        },
        navigation: {
          next: "#avatarUrl",
          previous: "#lastName",
          canSkip: () => true,
        },
      }),

      avatarUrl: promptFile<UpsertIdentityContext, any>({
        field: "avatarUrl",
        uploaded: (context, event) => {
          context.data.avatarUrl = event.data?.url;
          context.data.avatarMimeType = event.data?.mimeType;
        },
        params: {
          view: (editorContent.imageView = {
            title: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.title"),
            description: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.description"),
            placeholder: window.o.i18n("dapps.o-passport.processes.upsertIdentity.editorContent.imageView.placeholder"),
            submitButtonText: window.o.i18n(
              "dapps.o-passport.processes.upsertIdentity.editorContent.imageView.submitButtonText"
            ),
          }),
        },
        navigation: {
          next: "#upsertIdentity",
          previous: "#country",
          canSkip: () => true,
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
            profile: event.data,
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

export const upsertIdentity: ProcessDefinition<void, UpsertIdentityContextData> = {
  name: "upsertIdentity",
  stateMachine: <any>processDefinition,
};
