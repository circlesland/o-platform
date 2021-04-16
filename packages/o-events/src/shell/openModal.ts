import { PlatformEvent } from "../platformEvent";
import { PlatformEventTypes } from "../eventTypes";

export class OpenModal implements PlatformEvent {
  type: PlatformEventTypes = "shell.openModal";
}
