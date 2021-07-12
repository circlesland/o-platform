import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";

export type ShowNotificationsContextData = {
  notifications
};

export type ShowNotificationsContext = ProcessContext<ShowNotificationsContextData>;

const strings = {
};
/*
const processDefinition = (processId: string, skipIfNotDirty?: boolean) =>
  createMachine<ShowNotificationsContext, any>({
    id: `${processId}:showNotifications`,
    initial: "fetchNext",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<ShowNotificationsContext, any>("error"),

      fetchNext: {
        invoke: {
          src: async () => {}
        }
      },
      show: {
        on: {
          "markAsRead": {}
        }
      },
      description: prompt<ShowNotificationsContext, any>({
        field: "description",
        onlyWhenDirty: skipIfNotDirty,
        component: TextEditor,
        params: {
          label: strings.labelDescription,
          placeholder: strings.placeholderDescription,
          submitButtonText: strings.submitDescription,
        },
        navigation: {
          next: "#categoryTagId",
          previous: "#title",
          canSkip: () => true,
          skip: "#categoryTagId",
        },
      }),
      categoryTagId: promptTag<ShowNotificationsContext, any>({
        field: "categoryTagId",
        onlyWhenDirty: skipIfNotDirty,
        typeId: "o-marketplace:offer:category:1",
        params: {
          label: strings.labelCategory,
          placeholder: strings.placeholderCategory,
          submitButtonText: strings.submitCategory,
        },
        navigation: {
          next: "#geonameid",
          previous: "#description",
        },
      }),
      geonameid: promptCity<ShowNotificationsContext, any>({
        field: "geonameid",
        onlyWhenDirty: skipIfNotDirty,
        params: {
          label: strings.labelCity,
          placeholder: strings.placeholderCity,
          submitButtonText: strings.submitCity,
        },
        navigation: {
          next: "#unitTagId",
          previous: "#categoryTagId",
        },
      }),
      unitTagId: promptTag<ShowNotificationsContext, any>({
        field: "unitTagId",
        onlyWhenDirty: skipIfNotDirty,
        typeId: "o-marketplace:offer:unit:1",
        params: {
          label: strings.labelUnit,
          placeholder: strings.placeholderUnit,
          submitButtonText: strings.submitUnit,
        },
        navigation: {
          next: "#pricePerUnit",
          previous: "#geonameid",
        },
      }),
      pricePerUnit: prompt<ShowNotificationsContext, any>({
        field: "pricePerUnit",
        onlyWhenDirty: skipIfNotDirty,
        component: TextEditor,
        params: {
          label: strings.labelPricePerUnit,
          placeholder: strings.placeholderPricePerUnit,
          submitButtonText: strings.submitPricePerUnit,
        },
        navigation: {
          next: "#maxUnits",
          previous: "#unitTagId",
        },
      }),
      maxUnits: prompt<ShowNotificationsContext, any>({
        field: "maxUnits",
        onlyWhenDirty: skipIfNotDirty,
        component: TextEditor,
        params: {
          label: strings.labelMaxUnits,
          placeholder: strings.placeholderMaxUnits,
          submitButtonText: strings.submitMaxUnits,
        },
        navigation: {
          next: "#deliveryTermsTagId",
          previous: "#pricePerUnit",
        },
      }),
      deliveryTermsTagId: promptTag<ShowNotificationsContext, any>({
        field: "deliveryTermsTagId",
        onlyWhenDirty: skipIfNotDirty,
        typeId: "o-marketplace:offer:deliveryTerms:1",
        params: {
          label: strings.labelDeliveryTerms,
          placeholder: strings.placeholderDeliveryTerms,
          submitButtonText: strings.submitDeliveryTerms,
        },
        navigation: {
          next: "#pictureUrl",
          previous: "#pricePerUnit",
        },
      }),
      pictureUrl: promptFile<ShowNotificationsContext, any>({
        field: "pictureUrl",
        onlyWhenDirty: skipIfNotDirty,
        uploaded: (context, event) => {
          context.data.pictureUrl = event.data?.url;
          context.data.pictureMimeType = event.data?.mimeType;
        },
        params: {
          label: strings.labelPicture,
          submitButtonText: strings.submitPicture,
          cropShape: "rect",
        },
        navigation: {
          next: "#upsertOffer",
          previous: "#deliveryTermsTagId",
        },
      }),
      upsertOffer: {
        id: "upsertOffer",
        entry: () => console.log("upsertOffer entry"),
        invoke: {
          src: async (context) => {
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: ShowNotificationsDocument,
              variables: {
                id: context.data.id,
                geonameid: context.data.geonameid,
                categoryTagId: context.data.categoryTagId,
                createdByProfileId: context.data.geonameid,
                deliveryTermsTagId: context.data.deliveryTermsTagId,
                description: context.data.description,
                maxUnits: context.data.maxUnits
                  ? Number.parseFloat(context.data.maxUnits?.toString() ?? "0")
                  : undefined,
                pictureUrl: context.data.pictureUrl,
                pictureMimeType: context.data.pictureMimeType,
                pricePerUnit: context.data.pricePerUnit,
                title: context.data.title,
                unitTagId: context.data.unitTagId,
              },
            });
            return result.data.upsertOffer;
          },
          onDone: "#success",
          onError: "#error",
        },
      },
      success: {
        type: "final",
        id: "success",
        data: (context, event: any) => {
          console.log(`enter: upsertOffer.success`, context.data);
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.refresh",
            appId: "marketplace:1",
            offer: event.data,
          });
          return event.data;
        },
      },
    },
  });

export const upsertOffer: ProcessDefinition<void, upsertOfferContextData> = {
  name: "upsertOffer",
  stateMachine: <any>processDefinition,
};
*/