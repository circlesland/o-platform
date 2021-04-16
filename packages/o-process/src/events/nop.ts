import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";

export class Nop implements PlatformEvent {
  type: PlatformEventTypes = "process.nop";
}
