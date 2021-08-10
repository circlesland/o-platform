import { PlatformEvent } from "../platformEvent";
import { PlatformEventTypes } from "../eventTypes";

export class ScrollToBottom implements PlatformEvent {
  type: PlatformEventTypes = "shell.scrollToBottom";

  readonly scrollNow: boolean;

  constructor(scrollNow: boolean) {
    this.scrollNow = scrollNow;
  }
}
