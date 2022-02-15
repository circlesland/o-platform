import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";

export class ProcessStarted implements PlatformEvent {
  type: PlatformEventTypes = "shell.processStarted";
  readonly processId: string;

  constructor(processId:string) {
    this.processId = processId;
  }
}