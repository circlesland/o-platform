import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export interface Bubble extends PlatformEvent {
  type: "process.ipc.bubble",
  end?:boolean, // Is set to 'true' by the last process level before the event leaves xstate
  wrappedEvent: PlatformEvent,
  noReply?:boolean, // If set, indicates that the backtrace cannot be used to send events back
  levels: number, // How many levels the event already bubbled
  tag?: string // Can be used to identify the event
  trace: string[] // A list of state-ids that the event passed
}