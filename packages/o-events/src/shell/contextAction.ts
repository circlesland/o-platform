import { PlatformEvent } from "../platformEvent";
import { PlatformEventTypes } from "../eventTypes";
import {RuntimeDapp} from "../../../o-interfaces/dist/runtimeDapp";

export type CAction = {
  key: string;
  icon?: string;
  label: string;
  event: (runtimeDapp:RuntimeDapp<any>) => PlatformEvent
};
export class ContextAction implements PlatformEvent {
  readonly type: PlatformEventTypes = "shell.contextAction";
  readonly action: CAction;
  constructor(action:CAction) {
    this.action = action;
  }
}