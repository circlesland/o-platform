import { bubble } from "./bubble";
import { Prompt } from "../events/prompt";
import { ProcessContext } from "../interfaces/processContext";
import { AnyEventObject } from "xstate";
import {Schema} from "yup";

/**
 * Bubbles a 'process.prompt' event in order to show the specified component to the user.
 * @param spec
 */
export function show(spec: {
  passDataByReference?: boolean; // If the value of 'context.data' should be passed by reference (default: no)
  fieldName?: string;
  component: any;
  params?: {
    [x: string]: any;
  };
  navigation?: {
    canGoBack?: (
      context: ProcessContext<any>,
      event: AnyEventObject
    ) => boolean;
    canSkip?: (context: ProcessContext<any>, event: AnyEventObject) => boolean;
  };
  dataSchema?: Schema<any,any>;
}) {
  return bubble((context, event: AnyEventObject) => {
    const canGoBack = !spec.navigation?.canGoBack
      ? false
      : spec.navigation.canGoBack(context, event);
    const canSkip = !spec.navigation?.canSkip
      ? false
      : spec.navigation.canSkip(context, event);
    return <Prompt>{
      type: "process.prompt",
      fieldName: spec.fieldName,
      component: spec.component,
      data: spec.passDataByReference
        ? context.data
        : JSON.parse(JSON.stringify(context.data)),
      dirtyFlags: context.dirtyFlags,
      messages: context.messages,
      params: spec.params,
      navigation: {
        canGoBack,
        canSkip,
      },
      dataSchema: spec.dataSchema,
    };
  });
}
