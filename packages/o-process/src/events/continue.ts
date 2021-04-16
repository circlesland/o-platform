import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";

/**
 * Can be used as a generic trigger event or as response to a 'Prompt'.
 */
export class Continue implements PlatformEvent {
  type: PlatformEventTypes = "process.continue";
  data?: {
    [key: string]: any
  }
}
