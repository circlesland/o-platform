import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";

/**
 * Can be used to ask a process to repeat its last sent event.
 * This is useful to re-create the UI of an already running process e.g.
 * when a Prompt dialog was closed but should now be continued.
 */
export class Repeat implements PlatformEvent {
  type: PlatformEventTypes = "process.repeat";
}
