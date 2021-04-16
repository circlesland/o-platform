import { State } from "xstate";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";

export interface ProcessEvent {
  stopped: boolean;
  currentState?: State<any, PlatformEvent, any>;
  previousState?: State<any, PlatformEvent, any>;
  event?: PlatformEvent;
}
