import { actions, StateSchema, StatesConfig } from "xstate";
import { ProcessContext } from "../interfaces/processContext";
import { show } from "../actions/show";
import { Continue } from "../events/continue";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";

const { assign } = actions;

export type DynamicPromptField<TContext extends ProcessContext<any>> = {
  name: string;
  get: (context: TContext) => any;
  set: (o: any, context: TContext) => void;
};

export type PromptField<TContext extends ProcessContext<any>> =
  | string
  | DynamicPromptField<TContext>;

export function normalizePromptField<TContext extends ProcessContext<any>>(
  field: PromptField<TContext>
): DynamicPromptField<TContext> {
  if (typeof field == "string") {
    return {
      name: field,
      get: (context: TContext) => {
        return context.data[field];
      },
      set: (o: any, context: TContext) => {
        context.data[field] = o;
      },
    };
  } else {
    return <DynamicPromptField<TContext>>field;
  }
}

/**
 * Displays the specified editor to the user.
 * The editor is expected to understand the 'field' property
 * and the supplied params.
 *
 * @param spec
 */
export type PromptSpec<TContext extends ProcessContext<any>, TEvent> = {
  id?: string;
  entry?: (context: TContext, event: TEvent) => void;
  field: PromptField<TContext>;
  component: any;
  isSensitive?: boolean;
  /**
   * If set to 'true' every prompt will automatically submit its present data
   * and go to the next step if it's dirty flag is not set.
   */
  // onlyWhenDirty?: boolean;
  navigation?: {
    // If you want to allow the user to go one step back then specify here where he came from
    previous?: string;
    canGoBack?: (
      context: ProcessContext<TContext>,
      event: { type: string; [x: string]: any }
    ) => boolean;
    next?: string;
    skip?: string;
    canSkip?: (
      context: ProcessContext<TContext>,
      event: { type: string; [x: string]: any }
    ) => boolean;
  };
  params: { [x: string]: any } | ((context: TContext) => { [x: string]: any });
  dataSchema?: any; // ((context:TContext, event:TEvent) => any)|any;
};

export function prompt<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
>(spec: PromptSpec<TContext, TEvent>) {

  // Default 'canGoBack' (true when there are previous steps)
  let canGoBack: (context: ProcessContext<any>, event: any) => boolean = () =>
    !!spec.navigation?.previous;

  // When 'canGoBack' is externally specified then use the external function
  if (canGoBack && spec.navigation?.canGoBack) {
    canGoBack = spec.navigation.canGoBack;
  }

  const field = normalizePromptField(spec.field);
  const editDataFieldConfig: StatesConfig<TContext, StateSchema, TEvent> = {
    id: spec.id ?? spec.field,
    initial: "entry",
    states: {
      // If the spec contains an 'entry' action execute it now
      entry: {
        entry: (context: TContext, event: TEvent) => {
          // console.log(`entry: ${spec.id} ${spec.field}`)
          if (spec.entry) {
            spec.entry(context, event);
          }
        },
        always: "checkSkip",
      },
      checkSkip: {
        entry: () => console.log(`checkSkip: ${spec.id} ${spec.field}`),
        invoke: {
          src: async (context: TContext) => {
            // Emit 'context.data' as event.
            // 'validate' and 'submit' get their value from this event
            // in the case that 'checkSkip' == true.
            return context.data;
          },
          onDone: [
            {
              cond: (context: TContext) => {
                const skip =
                  context.onlyWhenDirty && !context.dirtyFlags[field.name];
                  // spec.onlyWhenDirty && !context.dirtyFlags[field.name];
                if (skip) {
                  console.log(
                    `checkSkip: ${spec.id} ${spec.field} - skipping because '${spec.field}' is not dirty and 'onlyWhenDirty' == true.`
                  );
                }
                return skip;
              },
              target: "validate",
            },
            {
              target: "show",
            },
          ],
          onError: "#error",
        },
      },
      show: {
        entry: [
          () => {
            console.log(`show: ${spec.id} ${spec.field}`);
          },
          show({
            field: spec.field,
            component: spec.component,
            params: spec.params,
            isSensitive: spec.isSensitive,
            navigation: {
              canGoBack: canGoBack,
              canSkip: spec.navigation?.canSkip,
            },
            dataSchema: spec.dataSchema,
          }),
        ],
        on: {
          "process.back": "back",
          "process.continue": [
            {
              cond: () => !spec.dataSchema,
              target: "submit",
            },
            {
              target: "validate",
            },
          ],
          "process.skip": "skip",
        },
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
            target: spec.navigation?.previous ?? "show",
          },
          {
            target: "show",
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
              delete context.messages[field.name];
              const valueToValidate = data[field.name];

              try {
                await spec.dataSchema.validate(valueToValidate, {
                  abortEarly: false,
                });
              } catch (e) {
                if (e.errors) {
                  context.messages[field.name] = e.errors;
                } else {
                  throw e;
                }
              }
            }

            return event.data;
          },
          onDone: [
            {
              cond: (context: TContext) => {
                return !context.messages[field.name];
              },
              target: "submit",
            },
            {
              target: "show",
            },
          ],
          onError: "#error",
        },
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
            if (field.get(context) !== data[field.name]) {
              field.set(data[field.name], context);
              context.dirtyFlags[field.name] = true;
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
