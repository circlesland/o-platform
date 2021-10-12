import { bubble } from "./bubble";
import { Prompt } from "../events/prompt";
import { ProcessContext } from "../interfaces/processContext";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {PromptSpec} from "../states/prompt";

export type PromptSpecOrFactory<TContext extends ProcessContext<any>, TEvent extends PlatformEvent>
    = PromptSpec<TContext, TEvent> | ((context:TContext, event:TEvent) => PromptSpec<TContext, TEvent>)

/**
 * Bubbles a 'process.prompt' event in order to show the specified component to the user.
 * @param spec
 */
export function show<TContext extends ProcessContext<any>, TEvent extends PlatformEvent>(
    spec: PromptSpecOrFactory<TContext, TEvent>)
{
  return bubble((context: TContext, event: any) => {
    const concreteSpec = typeof spec === "function" ? spec(context, event) : <PromptSpec<TContext, TEvent>>spec;
    const concreteParams = typeof concreteSpec.params === "function" ? concreteSpec.params(context) : concreteSpec.params;
    const canGoBack = !concreteSpec.navigation?.canGoBack
      ? false
      : concreteSpec.navigation.canGoBack(context, event);
    const canSkip = !concreteSpec.navigation?.canSkip
      ? false
      : concreteSpec.navigation.canSkip(context, event);

    return <Prompt<TContext>>{
      type: "process.prompt",
      skipIfNotDirty: context.onlyWhenDirty,
      field: concreteSpec.field,
      component: concreteSpec.component,
      data: /*concreteSpec.passDataByReference
        ? context.data
        : */JSON.parse(JSON.stringify(context.data)),
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
