import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";

/**
 * Can be used to ask for user input or to display status information.
 */
export class Prompt implements PlatformEvent {
  type: PlatformEventTypes = "process.prompt";

  fieldName?:string;

  /**
   * The component that should be displayed during a state.
   */
  component:any;

  /**
   * The data that should be edited (if any).
   */
  data:{[x:string]:any} = {};
  /**
   * The component specific params.
   */
  params:{[x:string]:any} = {};

  navigation: {
    canSkip: boolean,
    canGoBack: boolean,
    canSubmit: boolean
  } = {
    canSkip: false,
    canGoBack: false,
    canSubmit: true
  };
}
