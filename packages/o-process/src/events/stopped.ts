import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { PlatformEventTypes } from "@o-platform/o-events/dist/eventTypes";

export class Stopped implements PlatformEvent {
  type: PlatformEventTypes = "process.stopped";
  readonly processId: string;
  readonly result:any;

  constructor(processId:string, result?:any) {
    this.processId = processId;
    this.result = result;
  }
}
