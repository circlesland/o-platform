import { PlatformEvent } from "../platformEvent";
import { PlatformEventTypes } from "../eventTypes";

export class ShowNotification implements PlatformEvent {
  type: PlatformEventTypes = "shell.showNotification";

  readonly component: any;
  readonly mapping: any;

  constructor(component: any, mapping: any) {
    this.component = component;
    this.mapping = mapping;
  }
}
