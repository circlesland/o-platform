import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import { promptCity } from "../../../shared/api/promptCity";
import {
  City, PostAddress,
  UpsertShippingAddressDocument, UpsertShippingAddressMutationVariables
} from "../../../shared/api/data/types";
import {UpsertIdentityContext} from "./upsertIdentity";
import {ApiClient} from "../../../shared/apiConnection";
import {me} from "../../../shared/stores/me";

export type UpsertShippingAddressContextData = {
  id?: number;
  name: string;
  street: string;
  house: string;
  zip: string;
  cityGeonameid: number;
  city?: City;
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
            title: "Name at the door",
            description: "Please enter the name of the person or company you're shipping to"
          },
        },
        navigation: {
          canSkip: () => false,
          canGoBack: () => false,
          next: "#street"
        },
      }),

      street: prompt<UpsertShippingAddressContext, any>({
        field: "street",
        component: TextEditor,
        params: {
          view: {
            title: "Street",
            description: "Please enter the street you're shipping to"
          },
        },
        navigation: {
          next: "#house",
          previous: "#name",
          canSkip: () => false,
          canGoBack: () => true
        },
      }),

      house: prompt<UpsertShippingAddressContext, any>({
        field: "house",
        component: TextEditor,
        params: {
          view: {
            title: "House",
            description: "Please enter the house no. or name you're shipping to"
          },
        },
        navigation: {
          next: "#zip",
          previous: "#street",
          canSkip: () => false,
          canGoBack: () => true
        },
      }),

      zip: prompt<UpsertShippingAddressContext, any>({
        field: "zip",
        component: TextEditor,
        params: {
          view: {
            title: "Zip",
            description: "Please enter the zip you're shipping to"
          },
        },
        navigation: {
          next: "#city",
          previous: "#house",
          canSkip: () => false,
          canGoBack: () => true
        },
      }),

      city: promptCity<UpsertIdentityContext, any>({
        id: "city",
        field: "cityGeonameid",
        params: {
          view: {
            title: "City",
            description: "Please enter the city you're shipping to"
          },
        },
        navigation: {
          next: "#upsertShippingAddress",
          previous: "#zip",
          canSkip: () => false,
          canGoBack: () => true
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
                  cityGeonameid: context.data.cityGeonameid
                }
              });
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
