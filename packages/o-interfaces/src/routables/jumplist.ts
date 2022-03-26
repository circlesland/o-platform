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
  ) => Promise<JumplistItem[]>;
}

export interface JumplistItem {
  key: string;
  type?: "action" | "profile";
  icon?: string;
  title: string;
  category?: string;
  event?: PlatformEvent;
  colorClass?: string;
  action?: () => void;
}
