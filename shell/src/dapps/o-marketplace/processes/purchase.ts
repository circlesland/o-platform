import { ProcessDefinition } from "@o-platform/o-process/dist/interfaces/processManifest";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { fatalError } from "@o-platform/o-process/dist/states/fatalError";
import { createMachine } from "xstate";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";

export type PurchaseContextData = {
};

export type PurchaseContext = ProcessContext<PurchaseContextData>;

const strings = {
};

const processDefinition = (processId: string, skipIfNotDirty?: boolean) =>
    createMachine<PurchaseContext, any>({
        id: `${processId}:createOffer`,
        initial: "title",
        states: {
            // Include a default 'error' state that propagates the error by re-throwing it in an action.
            // TODO: Check if this works as intended
            ...fatalError<PurchaseContext, any>("error"),

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

export const purchase: ProcessDefinition<void, PurchaseContextData> = {
    name: "purchase",
    stateMachine: <any>processDefinition,
};
