import {actions, StateSchema, StatesConfig} from "xstate";
import { ProcessContext } from "../interfaces/processContext";
import { show } from "../actions/show";
import { Continue } from "../events/continue";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
const { assign } = actions;

export type PromptPictureSpec<TContext, TEvent> = {
    id?: string;
    entry?: (context:TContext, event:TEvent) => void;
    fieldName: string;
    previewComponent: any;
    editorComponent: any;
    /**
     * If set to 'true' every prompt will automatically submit its present data
     * and go to the next step if it's dirty flag is not set.
     */
    onlyWhenDirty?:boolean;
    navigation?: {
        // If you want to allow the user to go one step back then specify here where he came from
        previous?: string;
        canGoBack?: (
            context: ProcessContext<any>,
            event: { type: string; [x: string]: any }
        ) => boolean;
        next: string;
        skip?: string;
        canSkip?: (
            context: ProcessContext<any>,
            event: { type: string; [x: string]: any }
        ) => boolean;
    };
    params: { [x: string]: any }|((context:TContext)=>{[x: string]: any});
    dataSchema?: any // ((context:TContext, event:TEvent) => any)|any;
};

/**
 * Can be used on any string-field that contains a picture URL.
 * @param spec
 */
export function promptPicture<TContext extends ProcessContext<any>, TEvent extends PlatformEvent> (
    spec: PromptPictureSpec<TContext, TEvent>
)
{
    let canGoBack = (context: ProcessContext<any>, event: any) => !!spec.navigation?.previous;
    if (canGoBack && spec.navigation?.canGoBack) {
        canGoBack = spec.navigation.canGoBack;
    }
    const editDataFieldConfig: StatesConfig<TContext, StateSchema, TEvent> = {
        id: spec.id ?? spec.fieldName,
        initial: "entry",
        states: {
            // If the spec contains an 'entry' action execute it now
            entry: {
                entry: (context:TContext, event:TEvent) => {
                    console.log(`entry: ${spec.id} ${spec.fieldName}`)
                    if (spec.entry) {
                        spec.entry(context, event);
                    }
                },
                always: "checkSkip"
            },
            // If 'onlyWhenDirty' == 'true' and 'context.dirtyFlags' contains an entry or 'onlyWhenDirty' == 'false' then the editor is displayed.
            // If 'onlyWhenDirty' == 'true' abd no dirtyFlag is set, then the next step is the the validation.
            checkSkip: {
                entry: () => console.log(`checkSkip: ${spec.id} ${spec.fieldName}`),
                always:[{
                    cond: (context:TContext) => spec.onlyWhenDirty && !context.dirtyFlags[spec.fieldName],
                    target: "validate"
                }, {
                    target: "checkPreview"
                }]
            },
            // If 'context[fieldName]' already contains an image then it should be displayed first,
            // else the PictureEditor should be shown directly
            checkPreview: {
                entry: () => console.log(`checkPreview: ${spec.id} ${spec.fieldName}`),
                always:[{
                    cond:(context:TContext) => context.data[spec.fieldName]
                }]
            },
            showPreview: {
                entry: [
                    () => console.log(`showPreview: ${spec.id} ${spec.fieldName}`),
                    show({
                        fieldName: spec.fieldName,
                        component: spec.previewComponent,
                        params: spec.params,
                        navigation: {
                            canGoBack: canGoBack,
                            canSkip: spec.navigation?.canSkip,
                        },
                        dataSchema: spec.dataSchema,
                    }),
                ],
                on: {
                    "process.back": "back",
                    "process.continue": [{
                        cond: () => !spec.dataSchema,
                        target: "submit"
                    }, {
                        target: "validate"
                    }],
                    "process.skip": "skip",
                }
            },
            showEditor: {
                entry: [
                    () => console.log(`showEditor: ${spec.id} ${spec.fieldName}`),
                    show({
                        fieldName: spec.fieldName,
                        component: spec.editorComponent,
                        params: spec.params,
                        navigation: {
                            canGoBack: canGoBack,
                            canSkip: spec.navigation?.canSkip,
                        },
                        dataSchema: spec.dataSchema,
                    }),
                ],
                on: {
                    "process.back": "back",
                    "process.continue": [{
                        cond: () => !spec.dataSchema,
                        target: "submit"
                    }, {
                        target: "validate"
                    }],
                    "process.skip": "skip",
                }
            },
            back: {
                entry: () => console.log(`back: ${spec.fieldName}`),
                always: [
                    {
                        cond: (context: TContext, event: TEvent) => {
                            return (
                                spec.navigation?.previous &&
                                (!spec.navigation?.canGoBack ||
                                    spec.navigation.canGoBack(context, event))
                            );
                        },
                        target: spec.navigation?.previous ?? "show",
                    },
                    {
                        target: "show",
                    },
                ],
            },
            skip: {
                entry: () => console.log(`skip: ${spec.fieldName}`),
                always: [
                    {
                        cond: (context: TContext, event: TEvent) => {
                            return (
                                spec.navigation?.canSkip !== undefined &&
                                spec.navigation.canSkip(context, event)
                            );
                        },
                        target: spec.navigation?.skip ?? spec.navigation?.next ?? "show",
                    },
                    {
                        target: "show",
                    },
                ],
            },
            validate: {
                invoke: {
                    src: async (context: TContext, event: Continue) => {
                        const data = event.data;
                        if (!data) {
                            throw new Error(
                                `Couldn't read the 'data' property of the received Continue event: ${JSON.stringify(
                                    event
                                )}`
                            );
                        }
                        if (spec.dataSchema) {
                            delete context.messages[spec.fieldName];
                            const valueToValidate = data[spec.fieldName];
                            try {
                                await spec.dataSchema.validate(valueToValidate, {abortEarly: false})
                            } catch (e) {
                                if (e.errors) {
                                    context.messages[spec.fieldName] = e.errors;
                                } else {
                                    throw e;
                                }
                            }
                        }

                        return event.data;
                    },
                    onDone: [{
                        cond: (context:TContext) => !context.messages[spec.fieldName],
                        target: "submit"
                    }, {
                        target: "show"
                    }],
                    onError: "#error"
                }
            },
            submit: {
                entry: [
                    () => console.log(`submit: ${spec.fieldName}`),
                    assign((context: TContext, event: Continue) => {
                        // TODO: Try to use a nicer equivalence check for change tracking and setting the dirty flag
                        const data = event.data;
                        if (!data) {
                            throw new Error(
                                `Couldn't read the 'data' property of the received Continue event: ${JSON.stringify(
                                    event
                                )}`
                            );
                        }
                        if (context.data[spec.fieldName] !== data[spec.fieldName]) {
                            context.data[spec.fieldName] = data[spec.fieldName];
                            context.dirtyFlags[spec.fieldName] = true;
                        }
                        return context;
                    }),
                ],
                always: [
                    {
                        target: spec.navigation?.next ?? "show",
                    },
                ],
            },
        },
    };

    return editDataFieldConfig;
}
