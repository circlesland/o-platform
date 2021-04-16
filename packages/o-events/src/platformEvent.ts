import { PlatformEventTypes } from "./eventTypes";

export interface PlatformEvent {
  id?: string,
  responseToId?: string;
  type: PlatformEventTypes
}