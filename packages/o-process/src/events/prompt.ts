import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";
import {Schema} from "yup";

/**
 * Can be used to ask for user input or to display status information.
 */
export class Prompt implements PlatformEvent {
  type: PlatformEventTypes = "process.prompt";

  field?: string;

  /**
   * The component that should be displayed during a state.
   */
  component: any;

  /**
   * The data that should be edited (if any).
   */
  data: { [x: string]: any } = {};
  dirtyFlags: { [x: string]: boolean } = {};
  editorDirtyFlags: { [x: string]: boolean } = {};
  messages: { [x: string]: string } = {};
  /**
   * The component specific params.
   */
  params: { [x: string]: any } = {};

  /**
   * Can contain a "yup" schema. If set, the response to this prompt should
   * be validated against this schema.
   */
  dataSchema?: Schema<any,any>;

  /**
   * If set to 'true' tries to avoid to be saved in the browser's form auto-fill.
   */
  isSensitive?: boolean;

  navigation: {
    canSkip: boolean;
    canGoBack: boolean;
    canSubmit: boolean;
  } = {
    canSkip: false,
    canGoBack: false,
    canSubmit: true,
  };
}
