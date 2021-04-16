import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";

export class Success implements PlatformEvent {
  type: PlatformEventTypes = "process.success";
  result: any;
}
