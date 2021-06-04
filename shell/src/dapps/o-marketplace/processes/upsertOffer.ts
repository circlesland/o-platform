import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { prompt } from "@o-platform/o-process/dist/states/prompt";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import TextEditor from "@o-platform/o-editors/src/TextEditor.svelte";
import DropdownSelectEditor from "@o-platform/o-editors/src/DropdownSelectEditor.svelte";
import PictureEditor from "@o-platform/o-editors/src/PictureEditor.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { uploadFile } from "../../../shared/api/uploadFile";
import { ipc } from "@o-platform/o-process/dist/triggers/ipc";
import * as yup from "yup";
import HtmlViewer from "../../../../../packages/o-editors/src/HtmlViewer.svelte";
import {Choice} from "@o-platform/o-editors/src/choiceSelectorContext";
import {UpsertOfferDocument, OfferCategoriesDocument} from "../data/api/types";
import {CitiesByNameDocument} from "../../o-passport/data/api/types";
import {UpsertIdentityContext} from "../../o-passport/processes/upsertIdentity";

export type upsertOfferContextData = {
    createdByProfileId: number
    title: string
    pictureUrl: string
    pictureMimeType: string
    picture?: {
        bytes: Buffer;
        mimeType: string;
    };
    errorUploadingOfferPicture?: any
    description?: string
    categoryTagId: number
    geonameid: number
    pricePerUnit: string
    unitTagId: number
    maxUnits?: number
    deliveryTermsTagId: number
};

export type upsertOfferContext = ProcessContext<upsertOfferContextData>;

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
    createMachine<upsertOfferContext, any>({
        id: `${processId}:upsertOffer`,
        initial: "title",
        states: {
            // Include a default 'error' state that propagates the error by re-throwing it in an action.
            // TODO: Check if this works as intended
            ...fatalError<upsertOfferContext, any>("error"),

            title: prompt<upsertOfferContext, any>({
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
            description: prompt<upsertOfferContext, any>({
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
            categoryTagId: prompt<upsertOfferContext, any>({
                field: "categoryTagId",
                onlyWhenDirty: skipIfNotDirty,
                component: DropdownSelectEditor,
                params: {
                    label: strings.labelCategory,
                    placeholder: strings.placeholderCategory,
                    submitButtonText: strings.submitCategory,
                    asyncChoices: async (searchText?: string) => {
                        const apiClient = await window.o.apiClient.client.subscribeToResult();
                        const result = await apiClient.query({
                            query: OfferCategoriesDocument,
                            variables: {
                                like: searchText ?? ""
                            },
                        });

                        const items =
                            result.data.offerCategories && result.data.offerCategories.length > 0
                                ? result.data.offerCategories
                                    .map((o) => {
                                        return <Choice>{
                                            label: o,
                                            value: o
                                        };
                                    })
                                : [];

                        return items;
                    },
                    optionIdentifier: "value",
                    getOptionLabel: (option) => option.label,
                    getSelectionLabel: (option) => option.label,
                },
                navigation: {
                    next: "#geonameid",
                    previous: "#description"
                },
            }),
            geonameid: prompt<UpsertIdentityContext, any>({
                field: "geonameid",
                onlyWhenDirty: skipIfNotDirty,
                component: DropdownSelectEditor,
                params: {
                    label: strings.labelCity,
                    placeholder: strings.placeholderCity,
                    submitButtonText: strings.submitCity,
                    
                    asyncChoices: async (searchText?: string) => {
                        const n = <any>navigator;
                        const lang = n.language || n.userLanguage;
                        const apiClient = await window.o.apiClient.client.subscribeToResult();
                        const result = await apiClient.query({
                            query: CitiesByNameDocument,
                            variables: {
                                name: (searchText ?? "" ) + "%",
                                languageCode: lang.substr(0, 2)
                            },
                        });

                        const items =
                            result.data.cities && result.data.cities.length > 0
                                ? result.data.cities
                                    .map((o) => {
                                        return <Choice>{
                                            label: `${o.name} (${o.country})`,
                                            value: o.geonameid
                                        };
                                    })
                                : [];

                        return items;
                    },
                    optionIdentifier: "value",
                    getOptionLabel: (option) => option.label,
                    getSelectionLabel: (option) => option.label,
                },
                navigation: {
                    next: "#unit",
                    previous: "#categoryTagId"
                },
            }),
            unit: prompt<upsertOfferContext, any>({
                field: "unit",
                onlyWhenDirty: skipIfNotDirty,
                component: TextEditor,
                params: {
                    label: strings.labelUnit,
                    placeholder: strings.placeholderUnit,
                    submitButtonText: strings.submitUnit,
                },
                navigation: {
                    next: "#pricePerUnit",
                    previous: "#geonameid"
                },
            }),
            pricePerUnit: prompt<upsertOfferContext, any>({
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
                    previous: "#unit"
                },
            }),
            maxUnits: prompt<upsertOfferContext, any>({
                field: "maxUnits",
                onlyWhenDirty: skipIfNotDirty,
                component: TextEditor,
                params: {
                    label: strings.labelMaxUnits,
                    placeholder: strings.placeholderMaxUnits,
                    submitButtonText: strings.submitMaxUnits,
                },
                navigation: {
                    next: "#deliveryTerms",
                    previous: "#pricePerUnit"
                },
            }),
            deliveryTerms: prompt<upsertOfferContext, any>({
                field: "deliveryTerms",
                onlyWhenDirty: skipIfNotDirty,
                component: TextEditor,
                params: {
                    label: strings.labelDeliveryTerms,
                    placeholder: strings.placeholderDeliveryTerms,
                    submitButtonText: strings.submitDeliveryTerms,
                },
                navigation: {
                    next: "#picture",
                    previous: "#pricePerUnit"
                },
            }),
            picture: prompt<upsertOfferContext, any>({
                field: "picture",
                onlyWhenDirty: skipIfNotDirty,
                component: PictureEditor,
                params: {
                    label: strings.labelPicture,
                    submitButtonText: strings.submitPicture,
                },
                navigation: {
                    next: "#uploadOfferPicture",
                    previous: "#deliveryTerms"
                },
            }),
            uploadOfferPicture: {
                id: "uploadOfferPicture",
                on: {
                    ...(<any>ipc(`uploadOfferPicture`)),
                },
                entry: () => {
                    window.o.publishEvent(<PlatformEvent>{
                        type: "shell.progress",
                        message: `Uploading your picture ..`,
                    });
                },
                invoke: {
                    src: uploadFile.stateMachine("uploadOfferPicture"),
                    data: {
                        data: (context, event) => {
                            return {
                                appId: "__FILES_APP_ID__",
                                fileName: "offerPicture",
                                mimeType: context.data.picture.mimeType,
                                bytes: context.data.picture.bytes,
                            };
                        },
                        messages: {},
                        dirtyFlags: {},
                    },
                    onDone: [
                        {
                            cond: (context, event) => event.data instanceof Error,
                            target: "#errorUploadingOfferPicture",
                        },
                        {
                            target: "#upsertOffer",
                        },
                    ],
                    onError: "#errorUploadingOfferPicture",
                },
            },
            errorUploadingOfferPicture: prompt<upsertOfferContext, any>({
                field: "errorUploadingOfferPicture",
                entry: (context) => {
                    context.data.errorUploadingOfferPicture = `
            <b>Oops.</b><br/>
            We couldn't upload your avatar.<br/>
            <br/>
            Please make sure that your avatar doesn't exceed the maximum allowed file size of 4 MB.<br/>
            Either choose a different file or skip it for now.
          `;
                    context.dirtyFlags["pictureUrl"] = true;
                },
                component: HtmlViewer,
                isSensitive: true,
                params: {
                    submitButtonText: "Try again",
                    html: (context) => context.data.errorUploadingOfferPicture,
                },
                navigation: {
                    next: "#picture",
                },
            }),
            upsertOffer: {
                id: "upsertOffer",
                invoke: {
                    src: async (context, event:any) => {
                        if (event.data?.url) {
                            context.data.pictureUrl = event.data?.url;
                            context.data.pictureMimeType = event.data?.mimeType;
                        }
                        delete context.data.picture;
                        const apiClient = await window.o.apiClient.client.subscribeToResult();
                        const result = await apiClient.mutate({
                            mutation: UpsertOfferDocument,
                            variables: {
                                id: undefined,
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
                    window.o.publishEvent(<PlatformEvent>{
                        type: "shell.refresh",
                        appId: "marketplace:1",
                        offer: event.data
                    });
                },
            },
        },
    });

export const upsertOffer: ProcessDefinition<void, upsertOfferContextData> = {
    name: "upsertOffer",
    stateMachine: <any>processDefinition,
};
