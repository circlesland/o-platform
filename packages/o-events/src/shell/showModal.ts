import { PlatformEvent } from "../platformEvent";
import { PlatformEventTypes } from "../eventTypes";

export class ShowModal implements PlatformEvent {
  type: PlatformEventTypes = "shell.showModal";

  readonly component: any;

  constructor(component: any) {
    this.component = component;
  }
}
