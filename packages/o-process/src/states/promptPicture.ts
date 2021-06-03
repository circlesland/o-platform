import {actions, StateSchema, StatesConfig} from "xstate";
import { ProcessContext } from "../interfaces/processContext";
import { show } from "../actions/show";
import { Continue } from "../events/continue";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
const { assign } = actions;

export type PromptPictureSpec<TContext, TEvent> = {
    id?: string;
    entry?: (context:TContext, event:TEvent) => void;
    field: string;
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

    const pictureData: {
      bytes: Uint8Array,
      mimeType: string
    }|undefined = undefined;

    const editDataFieldConfig: StatesConfig<TContext, StateSchema, TEvent> = {
        id: spec.id ?? spec.field,
        initial: "entry",
        states: {
            // If the spec contains an 'entry' action execute it now
            entry: {
                entry: (context:TContext, event:TEvent) => {
                    console.log(`entry: ${spec.id} ${spec.field}`)
                    if (spec.entry) {
                        spec.entry(context, event);
                    }
                },
                always: "checkSkip"
            },
            // If 'onlyWhenDirty' == 'true' and 'context.dirtyFlags' contains an entry or 'onlyWhenDirty' == 'false' then the editor is displayed.
            // If 'onlyWhenDirty' == 'true' abd no dirtyFlag is set, then the next step is the the validation.
            checkSkip: {
                entry: () => console.log(`checkSkip: ${spec.id} ${spec.field}`),
                always:[{
                    cond: (context:TContext) => {
                        const skip = spec.onlyWhenDirty && !context.dirtyFlags[spec.field];
                        if (skip){
                            console.log(`checkSkip: ${spec.id} ${spec.field} - skipping because '${spec.field}' is not dirty and 'onlyWhenDirty' == true.`);
                        }
                        return skip;
                    },
                    target: "validate"
                }, {
                    target: "checkPreview"
                }]
            },
            // If 'context[field]' already contains an image then it should be displayed first,
            // else the PictureEditor should be shown directly
            checkPreview: {
                entry: () => console.log(`checkPreview: ${spec.id} ${spec.field}`),
                always:[{
                    cond:(context:TContext) =>
                    {
                        const hasValue = !!context.data[spec.field];
                        if (hasValue) {
                            console.log(`checkPreview: ${spec.id} ${spec.field} - showing preview for '${context.data[spec.field]}'`);
                        }
                        return hasValue;
                    },
                    target: "showPreview"
                }, {
                    target: "checkEditor"
                }]
            },
            showPreview: {
                entry: [
                    () => console.log(`showPreview: ${spec.id} ${spec.field}`),
                    show({
                        field: spec.field,
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
            checkEditor: {
                entry: () => console.log(`checkEditor: ${spec.id} ${spec.field}`),
                always:[{
                    cond:(context:TContext) =>
                    {
                        const noValueOrDirty = !context.data[spec.field] || context.dirtyFlags[spec.field];
                        if (noValueOrDirty) {
                            console.log(`checkEditor: ${spec.id} ${spec.field} - showing editor because the field has no value or is marked as 'dirty'.`);
                        }
                        return noValueOrDirty;
                    },
                    target: "showEditor"
                }, {
                    target: "validate"
                }]
            },
            showEditor: {
                entry: [
                    () => console.log(`showEditor: ${spec.id} ${spec.field}`),
                    show({
                        field: spec.field,
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
                entry: () => console.log(`back: ${spec.field}`),
                always: [
                    {
                        cond: (context: TContext, event: TEvent) => {
                            return (
                                spec.navigation?.previous &&
                                (!spec.navigation?.canGoBack ||
                                    spec.navigation.canGoBack(context, event))
                            );
                        },
                        target: spec.navigation?.previous ?? "checkPreview",
                    },
                    {
                        target: "checkPreview",
                    },
                ],
            },
            skip: {
                entry: () => console.log(`skip: ${spec.field}`),
                always: [
                    {
                        cond: (context: TContext, event: TEvent) => {
                            return (
                                spec.navigation?.canSkip !== undefined &&
                                spec.navigation.canSkip(context, event)
                            );
                        },
                        target: spec.navigation?.skip ?? spec.navigation?.next ?? "checkPreview",
                    },
                    {
                        target: "checkPreview",
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
                            delete context.messages[spec.field];
                            const valueToValidate = data[spec.field];
                            try {
                                await spec.dataSchema.validate(valueToValidate, {abortEarly: false})
                            } catch (e) {
                                if (e.errors) {
                                    context.messages[spec.field] = e.errors;
                                } else {
                                    throw e;
                                }
                            }
                        }

                        return event.data;
                    },
                    onDone: [{
                        cond: (context:TContext) => !context.messages[spec.field],
                        target: "submit"
                    }, {
                        target: "checkPreview"
                    }],
                    onError: "#error"
                }
            },
            submit: {
                entry: [
                    () => console.log(`submit: ${spec.field}`),
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
                        if (context.data[spec.field] !== data[spec.field]) {
                            context.data[spec.field] = data[spec.field];
                            context.dirtyFlags[spec.field] = true;
                        }
                        return context;
                    }),
                ],
                always: [
                    {
                        target: spec.navigation?.next ?? "checkPreview",
                    },
                ],
            },
        },
    };

    return editDataFieldConfig;
}
