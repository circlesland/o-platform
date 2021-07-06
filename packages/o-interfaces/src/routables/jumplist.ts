import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Routable } from "../routable";
import { RuntimeDapp } from "../runtimeDapp";
/**
 * Shows a menu with multiple buttons. Each button has an associated event which is sent when a button is pressed.
 */
export interface Jumplist<
  TParams extends { [x: string]: any },
  TDappState extends { [x: string]: any }
> extends Routable {
  type: "jumplist";
  items: (
    params: TParams,
    runtimeDapp: RuntimeDapp<TDappState>
  ) => JumplistItem[];
}

export interface JumplistItem {
  key: string;
  icon?: string;
  title: string;
  event?: PlatformEvent;
  action?: () => void;
}
