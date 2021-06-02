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
};

const processDefinition = (processId: string, skipIfNotDirty?: boolean) =>
    createMachine<CreateOfferContext, any>({
        id: `${processId}:createOffer`,
        initial: "title",
        states: {
            // Include a default 'error' state that propagates the error by re-throwing it in an action.
            // TODO: Check if this works as intended
            ...fatalError<CreateOfferContext, any>("error"),

            success: {
                type: "final",
                id: "success",
                data: (context, event: any) => {
                    console.log(`enter: upsertIdentity.success`, context.data);
                    window.o.publishEvent(<PlatformEvent>{
                        type: "shell.authenticated",
                        profile: context.data,
                    });
                    return event.data;
                },
            },
        },
    });

export const purchase: ProcessDefinition<void, CreateOfferContextData> = {
    name: "purchase",
    stateMachine: <any>processDefinition,
};
