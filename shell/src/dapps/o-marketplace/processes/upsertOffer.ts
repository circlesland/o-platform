import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import {prompt} from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import * as yup from "yup";
import {UpsertOfferDocument} from "../data/api/types";
import { promptFile } from "../../../shared/api/promptFile";
import {promptTag} from "../../../shared/api/promptTag";
import {promptCity} from "../../../shared/api/promptCity";

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

const strings = {
    labelTitle: "labelTitle",
    placeholderTitle: "placeholderTitle",
    submitTitle: "submitTitle",
    submitTitle_validation_missing: "submitTitle_validation_missing",

    labelDescription: "labelDescription",
    placeholderDescription: "placeholderDescription",
    submitDescription: "submitDescription",

    labelCategory: "labelCategory",
    placeholderCategory: "placeholderCategory",
    submitCategory: "submitCategory",

    labelCity: "labelCity",
    placeholderCity: "placeholderCity",
    submitCity: "submitCity",

    labelUnit: "labelUnit",
    placeholderUnit: "placeholderUnit",
    submitUnit: "submitUnit",

    labelPricePerUnit: "labelPricePerUnit",
    placeholderPricePerUnit: "placeholderPricePerUnit",
    submitPricePerUnit: "submitPricePerUnit",

    labelMaxUnits: "labelMaxUnits",
    placeholderMaxUnits: "placeholderMaxUnits",
    submitMaxUnits: "submitMaxUnits",

    labelDeliveryTerms: "labelDeliveryTerms",
    placeholderDeliveryTerms: "placeholderDeliveryTerms",
    submitDeliveryTerms: "submitDeliveryTerms",

    labelPicture: "labelPicture",
    submitPicture: "submitPicture",
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
                    label: strings.labelTitle,
                    placeholder: strings.placeholderTitle,
                    submitButtonText: strings.submitTitle,
                },
                dataSchema: yup.string().required(strings.submitTitle_validation_missing),
                navigation: {
                    next: "#description",
                },
            }),
            description: prompt<UpsertOfferContext, any>({
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
                    skip: "#categoryTagId"
                },
            }),
            categoryTagId: promptTag<UpsertOfferContext, any>({
                field: "categoryTagId",
                onlyWhenDirty: skipIfNotDirty,
                typeId: "o-marketplace:offer:category:1",
                params: {
                    label: strings.labelCategory,
                    placeholder: strings.placeholderCategory,
                    submitButtonText: strings.submitCategory
                },
                navigation: {
                    next: "#geonameid",
                    previous: "#description"
                },
            }),
            geonameid: promptCity<UpsertOfferContext, any>({
                field: "geonameid",
                onlyWhenDirty: skipIfNotDirty,
                params: {
                    label: strings.labelCity,
                    placeholder: strings.placeholderCity,
                    submitButtonText: strings.submitCity,
                },
                navigation: {
                    next: "#unitTagId",
                    previous: "#categoryTagId"
                }
            }),
            unitTagId: promptTag<UpsertOfferContext, any>({
                field: "unitTagId",
                onlyWhenDirty: skipIfNotDirty,
                typeId: "o-marketplace:offer:unit:1",
                params: {
                    label: strings.labelUnit,
                    placeholder: strings.placeholderUnit,
                    submitButtonText: strings.submitUnit
                },
                navigation: {
                    next: "#pricePerUnit",
                    previous: "#geonameid"
                },
            }),
            pricePerUnit: prompt<UpsertOfferContext, any>({
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
                    previous: "#unitTagId"
                },
            }),
            maxUnits: prompt<UpsertOfferContext, any>({
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
                    previous: "#pricePerUnit"
                },
            }),
            deliveryTermsTagId: promptTag<UpsertOfferContext, any>({
                field: "deliveryTermsTagId",
                onlyWhenDirty: skipIfNotDirty,
                typeId: "o-marketplace:offer:deliveryTerms:1",
                params: {
                    label: strings.labelDeliveryTerms,
                    placeholder: strings.placeholderDeliveryTerms,
                    submitButtonText: strings.submitDeliveryTerms
                },
                navigation: {
                    next: "#pictureUrl",
                    previous: "#pricePerUnit"
                },
            }),
            pictureUrl: promptFile<UpsertOfferContext, any>({
                field: "pictureUrl",
                onlyWhenDirty: skipIfNotDirty,
                uploaded:(context, event) => {
                    context.data.pictureUrl = event.data?.url;
                    context.data.pictureMimeType = event.data?.mimeType;
                },
                params: {
                    label: strings.labelPicture,
                    submitButtonText: strings.submitPicture
                },
                navigation: {
                    next: "#upsertOffer",
                    previous: "#deliveryTermsTagId"
                }
            }),
            upsertOffer: {
                id: "upsertOffer",
                entry: () => console.log("upsertOffer entry"),
                invoke: {
                    src: async (context) => {
                        const apiClient = await window.o.apiClient.client.subscribeToResult();
                        const result = await apiClient.mutate({
                            mutation: UpsertOfferDocument,
                            variables: {
                                id: context.data.id,
                                geonameid: context.data.geonameid,
                                categoryTagId: context.data.categoryTagId,
                                createdByProfileId: context.data.geonameid,
                                deliveryTermsTagId: context.data.deliveryTermsTagId,
                                description: context.data.description,
                                maxUnits: context.data.maxUnits ? Number.parseFloat(context.data.maxUnits?.toString() ?? "0") : undefined,
                                pictureUrl: context.data.pictureUrl,
                                pictureMimeType: context.data.pictureMimeType,
                                pricePerUnit: context.data.pricePerUnit,
                                title: context.data.title,
                                unitTagId: context.data.unitTagId
                            }
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
                        offer: event.data
                    });
                    return event.data;
                },
            }
        },
    });

export const upsertOffer: ProcessDefinition<void, upsertOfferContextData> = {
    name: "upsertOffer",
    stateMachine: <any>processDefinition,
};
