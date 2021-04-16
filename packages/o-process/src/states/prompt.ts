import { actions } from "xstate";
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
export function prompt<
  TContext extends ProcessContext<any>,
  TEvent extends PlatformEvent
>(spec: {
  fieldName: string;
  component: any;
  id?: string;
  navigation?: {
    // If you want to allow the user to go one step back then specify here where he came from
    previous?: string;
    canGoBack?: (
      context: ProcessContext<any>,
      event: { type: string; [x: string]: any }
    ) => boolean;
    next: string;
    canSkip?: (
      context: ProcessContext<any>,
      event: { type: string; [x: string]: any }
    ) => boolean;
  };
  params: { [x: string]: any };
}) {
  let canGoBack = (context:ProcessContext<any>, event:any) => !!spec.navigation?.previous;
  if (canGoBack && spec.navigation?.canGoBack) {
    canGoBack = spec.navigation.canGoBack
  }
  const editDataFieldConfig: any = {
    // TODO: Fix need for 'any'
    id: spec.id ?? spec.fieldName,
    initial: "show",
    states: {
      show: {
        entry: [
          () => console.log(`show: ${spec.id} ${spec.fieldName}`),
          show({
            fieldName: spec.fieldName,
            component: spec.component,
            params: spec.params,
            navigation: {
              canGoBack: canGoBack,
              canSkip: spec.navigation?.canSkip,
            },
          }),
        ],
        on: {
          "process.back": "back",
          "process.continue": "submit",
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
            target: spec.navigation?.next ?? "show",
          },
          {
            target: "show",
          },
        ],
      },
      submit: {
        entry: [
          () => console.log(`submit: ${spec.fieldName}`),
          assign((context: TContext, event: Continue) => {
            // TODO: Try to use a nicer equivalence check for change tracking and setting the dirty flag
            // TODO: How to handle validation?
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
