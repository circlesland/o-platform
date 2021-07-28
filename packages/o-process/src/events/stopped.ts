import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";

export class Stopped implements PlatformEvent {
  type: PlatformEventTypes = "process.stopped";
  readonly processId: string;

  constructor(processId:string) {
    this.processId = processId;
  }
}
