import { PlatformEvent } from "../platformEvent";
import { PlatformEventTypes } from "../eventTypes";

export class NavigateTo implements PlatformEvent {
  type: PlatformEventTypes = "shell.navigateTo";

  readonly route: string;

  constructor(route: string) {
    this.route = route;
  }
}
