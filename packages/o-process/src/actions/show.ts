import { bubble } from "./bubble";
import { Prompt } from "../events/prompt";
import { ProcessContext } from "../interfaces/processContext";
import { AnyEventObject } from "xstate";
import {Schema} from "yup";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type PromptSpec<TContext> = {
  passDataByReference?: boolean; // If the value of 'context.data' should be passed by reference (default: no)
  field?: string;
  component: any;
  params?: { [x: string]: any }|((context:TContext)=>{[x: string]: any});
  /**
   * If set to 'true' tries to avoid to be saved in the browser's form auto-fill.
   */
  isSensitive?: boolean;
  navigation?: {
    canGoBack?: (
        context: ProcessContext<any>,
        event: AnyEventObject
    ) => boolean;
    canSkip?: (context: ProcessContext<any>, event: AnyEventObject) => boolean;
  };
  dataSchema?: Schema<any,any>;
};

export type PromptSpecOrFactory<TContext extends ProcessContext<any>, TEvent extends PlatformEvent>
    = PromptSpec<TContext> | ((context:TContext, event:TEvent) => PromptSpec<TContext>)

/**
 * Bubbles a 'process.prompt' event in order to show the specified component to the user.
 * @param spec
 */
export function show<TContext extends ProcessContext<any>, TEvent extends PlatformEvent>(spec: PromptSpecOrFactory<TContext, TEvent>) {
  return bubble((context: TContext, event: any) => {
    const concreteSpec = typeof spec === "function" ? spec(context, event) : <PromptSpec<TContext>>spec;
    const concreteParams = typeof concreteSpec.params === "function" ? concreteSpec.params(context) : concreteSpec.params;
    const canGoBack = !concreteSpec.navigation?.canGoBack
      ? false
      : concreteSpec.navigation.canGoBack(context, event);
    const canSkip = !concreteSpec.navigation?.canSkip
      ? false
      : concreteSpec.navigation.canSkip(context, event);
    return <Prompt>{
      type: "process.prompt",
      field: concreteSpec.field,
      component: concreteSpec.component,
      data: concreteSpec.passDataByReference
        ? context.data
        : JSON.parse(JSON.stringify(context.data)),
      dirtyFlags: context.dirtyFlags,
      messages: context.messages,
      params: concreteParams,
      isSensitive: concreteSpec.isSensitive,
      navigation: {
        canGoBack,
        canSkip,
      },
      dataSchema: concreteSpec.dataSchema,
    };
  });
}
