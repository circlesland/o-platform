import {actions, send} from "xstate";
import { ProcessContext } from "../interfaces/processContext";
import { show } from "../actions/show";
import { Continue } from "../events/continue";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
const { assign } = actions;

/**
 * Displays the specified editor to the user.
 * The editor is expected to understand the 'fieldName' property
 * and the supplied params.
 *
 * @param spec
 */

export type PromptSpec<TContext, TEvent> = {
  entry?: (context:TContext, event:TEvent) => void;
  fieldName: string;
  component: any;
  id?: string;
  isSensitive?: boolean;
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

function isFunction(functionToCheck:any) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function prompt<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
>(spec: PromptSpec<TContext, TEvent>) {
  let canGoBack = (context: ProcessContext<any>, event: any) => !!spec.navigation?.previous;
  if (canGoBack && spec.navigation?.canGoBack) {
    canGoBack = spec.navigation.canGoBack;
  }
  const editDataFieldConfig: any = {
    // TODO: Fix 'any'
    id: spec.id ?? spec.fieldName,
    initial: "checkSkip",
    states: {
      checkSkip: {
        entry: (context:TContext, event:TEvent) => {
          console.log(`show: ${spec.id} ${spec.fieldName}`)
          if (spec.entry) {
            spec.entry(context, event);
          }
        },
        invoke: {
          src: async (context:TContext) => {
            return context.data;
          },
          onDone:[{
            cond: (context:TContext) => spec.onlyWhenDirty && !context.dirtyFlags[spec.fieldName],
            actions: [
              () => console.log(`checkSkip: skipping because '${spec.fieldName}' is not dirty and 'onlyWhenDirty' == true.`)
            ],
            target: "validate",
          }, {
            target: "show"
          }],
          onError: "#error"
        }
      },
      show: {
        entry: [
          () => {
            console.log(`show: ${spec.id} ${spec.fieldName}`);
          },
          show({
            fieldName: spec.fieldName,
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
          "process.continue": [{
            cond: () => !spec.dataSchema,
            target: "submit"
          }, {
            target: "validate"
          }],
          "process.skip": "skip",
        },
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
