import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";

export class Cancel implements PlatformEvent {
  type: PlatformEventTypes = "process.cancel";
}

export class CancelRequest implements PlatformEvent {
  type: PlatformEventTypes = "process.cancelRequest";
}
