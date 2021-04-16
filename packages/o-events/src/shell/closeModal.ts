import { PlatformEvent } from "../platformEvent";
import { PlatformEventTypes } from "../eventTypes";

export class CloseModal implements PlatformEvent {
  type: PlatformEventTypes = "shell.closeModal";
}
