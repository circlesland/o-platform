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
import {CreateOfferDocument, OfferCategoriesDocument} from "../data/api/types";
import {CitiesByNameDocument} from "../../o-passport/data/api/types";
import {UpsertIdentityContext} from "../../o-passport/processes/upsertIdentity";

export type CreateOfferContextData = {
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
    category: string
    geonameid: number
    pricePerUnit: string
    unit: string
    maxUnits?: number
    deliveryTerms: string
};

export type CreateOfferContext = ProcessContext<CreateOfferContextData>;

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
    createMachine<CreateOfferContext, any>({
        id: `${processId}:createOffer`,
        initial: "title",
        states: {
            // Include a default 'error' state that propagates the error by re-throwing it in an action.
            // TODO: Check if this works as intended
            ...fatalError<CreateOfferContext, any>("error"),

            title: prompt<CreateOfferContext, any>({
                fieldName: "title",
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
            description: prompt<CreateOfferContext, any>({
                fieldName: "description",
                onlyWhenDirty: skipIfNotDirty,
                component: TextEditor,
                params: {
                    label: strings.labelDescription,
                    placeholder: strings.placeholderDescription,
                    submitButtonText: strings.submitDescription,
                },
                navigation: {
                    next: "#category",
                    previous: "#title",
                    canSkip: () => true,
                    skip: "#category"
                },
            }),
            category: prompt<CreateOfferContext, any>({
                fieldName: "category",
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
                fieldName: "geonameid",
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
                    previous: "#category"
                },
            }),
            unit: prompt<CreateOfferContext, any>({
                fieldName: "unit",
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
            pricePerUnit: prompt<CreateOfferContext, any>({
                fieldName: "pricePerUnit",
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
            maxUnits: prompt<CreateOfferContext, any>({
                fieldName: "maxUnits",
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
            deliveryTerms: prompt<CreateOfferContext, any>({
                fieldName: "deliveryTerms",
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
            picture: prompt<CreateOfferContext, any>({
                fieldName: "picture",
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
                            target: "#createOffer",
                        },
                    ],
                    onError: "#errorUploadingOfferPicture",
                },
            },
            errorUploadingOfferPicture: prompt<CreateOfferContext, any>({
                fieldName: "errorUploadingOfferPicture",
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
            createOffer: {
                id: "createOffer",
                invoke: {
                    src: async (context, event) => {
                        if (event.data?.url) {
                            context.data.pictureUrl = event.data?.url;
                            context.data.pictureMimeType = event.data?.mimeType;
                        }
                        delete context.data.picture;
                        const apiClient = await window.o.apiClient.client.subscribeToResult();
                        const result = await apiClient.mutate({
                            mutation: CreateOfferDocument,
                            variables: {
                                geonameid: context.data.geonameid,
                                category: context.data.category,
                                createdByProfileId: context.data.geonameid,
                                deliveryTerms: context.data.deliveryTerms,
                                description: context.data.description,
                                maxUnits: context.data.maxUnits ? Number.parseFloat(context.data.maxUnits?.toString() ?? "0") : undefined,
                                pictureUrl: context.data.pictureUrl,
                                pictureMimeType: context.data.pictureMimeType,
                                pricePerUnit: context.data.pricePerUnit,
                                title: context.data.title,
                                unit: context.data.unit
                            }
                        });
                        return result.data.createOffer;
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

export const createOffer: ProcessDefinition<void, CreateOfferContextData> = {
    name: "createOffer",
    stateMachine: <any>processDefinition,
};
