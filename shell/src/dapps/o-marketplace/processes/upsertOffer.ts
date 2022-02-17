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
// import { UpsertOfferDocument } from "../../../shared/api/data/types";
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
    title: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.title.title"),
    description: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.title.description"),
    placeholder: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.title.placeholder"),
    submitButtonText: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.title.submitButtonText"),
  },
  description: {
    title: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.description.title"),
    description: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.description.description"),
    placeholder: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.description.placeholder"),
    submitButtonText: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.description.submitButtonText"),
  },
  offerlocation: {
    title: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerLocation.title"),
    description: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerLocation.description"),
    placeholder: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerLocation.placeholder"),
    submitButtonText: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerLocation.submitButtonText"),
  },
  offerCategory: {
    title: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerCategory.title"),
    description: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerCategory.description"),
    placeholder: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerCategory.placeholder"),
    submitButtonText: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerCategory.submitButtonText"),
  },
  offerUnit: {
    title: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerUnit.title"),
    description: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerUnit.description"),
    placeholder: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerUnit.placeholder"),
    submitButtonText: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerUnit.submitButtonText"),
  },
  offerPrice: {
    title: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerPrice.title"),
    description: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerPrice.description"),
    placeholder: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerPrice.placeholder"),
    submitButtonText: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerPrice.submitButtonText"),
  },
  offerUnitAmount: {
    title: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerUnitAmount.title"),
    description: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerUnitAmount.description"),
    placeholder: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerUnitAmount.placeholder"),
    submitButtonText: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerUnitAmount.submitButtonText"),
  },
  offerDelivery: {
    title: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerDelivery.title"),
    description: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerDelivery.description"),
    placeholder: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerDelivery.placeholder"),
    submitButtonText: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerDelivery.submitButtonText"),
  },
  offerImage: {
    title: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerImage.title"),
    description: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerImage.description"),
    placeholder: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerImage.placeholder"),
    submitButtonText: window.i18n("dapps.o-marketpace.processes.upsertOffer.editorContent.offerImage.submitButtonText"),
  },
};


const processDefinition = (processId: string) =>
  createMachine<UpsertOfferContext, any>({
    id: `${processId}:upsertOffer`,
    initial: "title",
    states: {
      // Include a default 'error' state that propagates the error by re-throwing it in an action.
      // TODO: Check if this works as intended
      ...fatalError<UpsertOfferContext, any>("error"),

      title: prompt<UpsertOfferContext, any>({
        field: "title",
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
            /*
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
             */
            return <any>{};
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
