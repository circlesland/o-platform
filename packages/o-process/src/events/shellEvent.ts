import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";

export class ShellEvent implements PlatformEvent {
  type: PlatformEventTypes = "process.shellEvent";
  payload: PlatformEvent;

  constructor(payload:PlatformEvent)
  {
    this.payload = payload;
  }
}
