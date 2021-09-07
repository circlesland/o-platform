import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { EditorViewContext } from "@o-platform/o-editors/src/shared/editorViewContext";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import TextareaEditor from "@o-platform/o-editors/src/TextareaEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import * as yup from "yup";
import { UpsertOfferDocument } from "../data/api/types";
import { promptFile } from "../../../shared/api/promptFile";
import { promptTag } from "../../../shared/api/promptTag";
import { promptCity } from "../../../shared/api/promptCity";

export type upsertOfferContextData = {
  id: string;
  createdByProfileId: number;
  title: string;
  pictureUrl: string;
  pictureMimeType: string;
  errorUploadingOfferPicture?: any;
  description?: string;
  categoryTagId: number;
  geonameid: number;
  pricePerUnit: string;
  unitTagId: number;
  maxUnits?: number;
  deliveryTermsTagId: number;
};

export type UpsertOfferContext = ProcessContext<upsertOfferContextData>;

// TODO: VALIDATION STRINGS! global etc...
const strings = {
  submitTitle_validation_missing: "submitTitle_validation_missing",
};

const editorContent: { [x: string]: EditorViewContext } = {
  title: {
    title: "Title",
    description:
      "Enter the title of what you are selling. keep it short & sweet.",
    placeholder: "Title",
    submitButtonText: "Next",
  },
  description: {
    title: "Description",
    description:
      "Describe your item in detail. Make it sound sexy. Try to make it fit into 500 Characters.",
    placeholder: "Item description",
    submitButtonText: "Next",
  },
  offerlocation: {
    title: "Item location",
    description: "Select the City from which this item is being sold.",
    placeholder: "City",
    submitButtonText: "Next",
  },
  offerCategory: {
    title: "Select a Category",
    description: "Choose a category for your listing so it's easier to find.",
    placeholder: "Category",
    submitButtonText: "Next",
  },
  offerUnit: {
    title: "Select a Unit",
    description:
      "Choose a unit for your listing so it's easy to understand the amount.",
    placeholder: "Unit",
    submitButtonText: "Next",
  },
  offerPrice: {
    title: "Price",
    description: "Please enter the amount of circles your want for your item.",
    placeholder: "Price",
    submitButtonText: "Next",
  },
  offerUnitAmount: {
    title: "Amount",
    description: "Please enter how many of these items you are selling.",
    placeholder: "e.g. 1",
    submitButtonText: "Next",
  },
  offerDelivery: {
    title: "Delivery",
    description: "Please choose the delivery method for your offer.",
    placeholder: "",
    submitButtonText: "Next",
  },
  offerImage: {
    title: "Add a Picture",
    description:
      "Adding a Picture to your offer increases the change of being sold by 90%",
    placeholder: "",
    submitButtonText: "Publish Offer",
  },
};

const processDefinition = (processId: string, skipIfNotDirty?: boolean) =>
  createMachine<UpsertOfferContext, any>({
    id: `${processId}:upsertOffer`,
    initial: "title",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UpsertOfferContext, any>("error"),

      title: prompt<UpsertOfferContext, any>({
        field: "title",
        onlyWhenDirty: skipIfNotDirty,
        component: TextEditor,
        params: {
          view: editorContent.title,
        },
        dataSchema: yup
          .string()
          .required(strings.submitTitle_validation_missing),
        navigation: {
          next: "#description",
        },
      }),
      description: prompt<UpsertOfferContext, any>({
        field: "description",
        onlyWhenDirty: skipIfNotDirty,
        component: TextareaEditor,
        params: {
          view: editorContent.description,
          showResultsOnLoad: true,
        },
        navigation: {
          next: "#categoryTagId",
          previous: "#title",
          canSkip: () => true,
          skip: "#categoryTagId",
        },
      }),
      categoryTagId: promptTag<UpsertOfferContext, any>({
        field: "categoryTagId",
        onlyWhenDirty: skipIfNotDirty,
        typeId: "o-marketplace:offer:category:1",
        params: {
          view: editorContent.offerCategory,
          showResultsOnLoad: true,
        },
        navigation: {
          next: "#geonameid",
          previous: "#description",
        },
      }),
      geonameid: promptCity<UpsertOfferContext, any>({
        field: "geonameid",
        onlyWhenDirty: skipIfNotDirty,
        params: {
          view: editorContent.offerlocation,
        },
        navigation: {
          next: "#unitTagId",
          previous: "#categoryTagId",
        },
      }),
      unitTagId: promptTag<UpsertOfferContext, any>({
        field: "unitTagId",
        onlyWhenDirty: skipIfNotDirty,
        typeId: "o-marketplace:offer:unit:1",
        params: {
          view: editorContent.offerUnit,
          showResultsOnLoad: true,
        },
        navigation: {
          next: "#pricePerUnit",
          previous: "#geonameid",
        },
      }),
      pricePerUnit: prompt<UpsertOfferContext, any>({
        field: "pricePerUnit",
        onlyWhenDirty: skipIfNotDirty,
        component: TextEditor,
        params: {
          view: editorContent.offerPrice,
        },
        navigation: {
          next: "#maxUnits",
          previous: "#unitTagId",
        },
      }),
      maxUnits: prompt<UpsertOfferContext, any>({
        field: "maxUnits",
        onlyWhenDirty: skipIfNotDirty,
        component: TextEditor,
        params: {
          view: editorContent.offerUnitAmount,
        },
        navigation: {
          next: "#deliveryTermsTagId",
          previous: "#pricePerUnit",
        },
      }),
      deliveryTermsTagId: promptTag<UpsertOfferContext, any>({
        field: "deliveryTermsTagId",
        onlyWhenDirty: skipIfNotDirty,
        typeId: "o-marketplace:offer:deliveryTerms:1",
        params: {
          view: editorContent.offerDelivery,
          showResultsOnLoad: true,
        },
        navigation: {
          next: "#pictureUrl",
          previous: "#pricePerUnit",
        },
      }),
      pictureUrl: promptFile<UpsertOfferContext, any>({
        field: "pictureUrl",
        onlyWhenDirty: skipIfNotDirty,
        uploaded: (context, event) => {
          context.data.pictureUrl = event.data?.url;
          context.data.pictureMimeType = event.data?.mimeType;
        },
        params: {
          view: editorContent.offerImage,
          cropShape: "rect",
        },
        navigation: {
          next: "#upsertOffer",
          previous: "#deliveryTermsTagId",
        },
      }),
      upsertOffer: {
        id: "upsertOffer",
        // entry: () => console.log("upsertOffer entry"),
        invoke: {
          src: async (context) => {
            const apiClient =
              await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.mutate({
              mutation: UpsertOfferDocument,
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
          // console.log(`enter: upsertOffer.success`, context.data);
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
