import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export interface Sinker extends PlatformEvent {
  type: "process.ipc.sinker",
  wrappedEvent: PlatformEvent,
  levels: number, // How many levels the event already sunk
  tag: string // Can be used to identify the event
  backTrace: string[] // A list of state-ids that the corresponding bubble passed
  trace: string[] // A list of state-ids that the sinker passed
}