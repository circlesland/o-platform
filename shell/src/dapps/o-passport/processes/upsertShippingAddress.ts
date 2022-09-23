import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import { promptCity } from "../../../shared/api/promptCity";
import {
  City,
  PostAddress,
  UpsertShippingAddressDocument,
  UpsertShippingAddressMutationVariables,
} from "../../../shared/api/data/types";
import { UpsertIdentityContext } from "./upsertIdentity";
import { ApiClient } from "../../../shared/apiConnection";
import { me } from "../../../shared/stores/me";
import EmailAddressEditor from "@o-platform/o-editors/src/EmailAddressEditor.svelte";

export type UpsertShippingAddressContextData = {
  id?: number;
  name: string;
  street: string;
  house: string;
  zip: string;
  cityGeonameid: number;
  city?: City;
  notificationEmail?: string;
  successAction?: (data: UpsertShippingAddressContextData) => void;
};

export type UpsertShippingAddressContext = ProcessContext<UpsertShippingAddressContextData>;

const processDefinition = (processId: string) =>
  createMachine<UpsertShippingAddressContext, any>({
    id: `${processId}:upsertDeliveryAddress`,
    initial: "name",
    states: {
      ...fatalError<UpsertShippingAddressContext, any>("error"),
      name: prompt<UpsertShippingAddressContext, any>({
        field: "name",
        component: TextEditor,
        params: {
          view: {
            title: window.o.i18n("dapps.o-passport.processes.identify.NameAtTheDoor.title"),
            description: window.o.i18n("dapps.o-passport.processes.identify.NameAtTheDoor.description"),
          },
        },
        navigation: {
          canSkip: () => false,
          canGoBack: () => false,
          next: "#street",
        },
      }),

      street: prompt<UpsertShippingAddressContext, any>({
        field: "street",
        component: TextEditor,
        params: {
          view: {
            title: window.o.i18n("dapps.o-passport.processes.identify.street.title"),
            description: window.o.i18n("dapps.o-passport.processes.identify.street.description"),
          },
        },
        navigation: {
          next: "#house",
          previous: "#name",
          canSkip: () => false,
          canGoBack: () => true,
        },
      }),

      house: prompt<UpsertShippingAddressContext, any>({
        field: "house",
        component: TextEditor,
        params: {
          view: {
            title: window.o.i18n("dapps.o-passport.processes.identify.house.title"),
            description: window.o.i18n("dapps.o-passport.processes.identify.house.description"),
          },
        },
        navigation: {
          next: "#zip",
          previous: "#street",
          canSkip: () => false,
          canGoBack: () => true,
        },
      }),

      zip: prompt<UpsertShippingAddressContext, any>({
        field: "zip",
        component: TextEditor,
        params: {
          view: {
            title: window.o.i18n("dapps.o-passport.processes.identify.zip.title"),
            description: window.o.i18n("dapps.o-passport.processes.identify.zip.description"),
          },
        },
        navigation: {
          next: "#city",
          previous: "#house",
          canSkip: () => false,
          canGoBack: () => true,
        },
      }),

      city: promptCity<UpsertIdentityContext, any>({
        id: "city",
        field: "cityGeonameid",
        params: {
          view: {
            title: window.o.i18n("dapps.o-passport.processes.identify.city.title"),
            description: window.o.i18n("dapps.o-passport.processes.identify.city.description"),
          },
        },
        navigation: {
          next: "#notificationEmail",
          previous: "#zip",
          canSkip: () => false,
          canGoBack: () => true,
        },
      }),

      notificationEmail: prompt<UpsertShippingAddressContext, any>({
        id: "notificationEmail",
        field: "notificationEmail",
        component: EmailAddressEditor,
        params: {
          view: {
            title: window.o.i18n("dapps.o-passport.processes.identify.notificationEmail.title"),
            description: window.o.i18n("dapps.o-passport.processes.identify.notificationEmail.description"),
          },
        },
        navigation: {
          next: "#upsertShippingAddress",
          previous: "#city",
          canSkip: () => false,
          canGoBack: () => true,
        },
      }),

      upsertShippingAddress: {
        id: "upsertShippingAddress",
        invoke: {
          src: async (context) => {
            const result = await ApiClient.mutate<PostAddress, UpsertShippingAddressMutationVariables>(
              UpsertShippingAddressDocument,
              {
                data: {
                  id: context.data.id,
                  house: context.data.house,
                  zip: context.data.zip,
                  street: context.data.street,
                  name: context.data.name,
                  cityGeonameid: context.data.cityGeonameid,
                  notificationEmail: context.data.notificationEmail,
                },
              }
            );
            context.data.id = result.id;
            return result;
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        type: "final",
        id: "success",
        data: (context, event: any) => {
          if (context.data.successAction) {
            me.reload().then(() => context.data.successAction(context.data));
          }
          return event.data;
        },
      },
    },
  });

export const upsertShippingAddress: ProcessDefinition<void, UpsertShippingAddressContext> = {
  name: "upsertShippingAddress",
  stateMachine: <any>processDefinition,
};
