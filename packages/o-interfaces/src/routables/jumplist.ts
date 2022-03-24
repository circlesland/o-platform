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
  lists: (
    params: TParams,
    runtimeDapp: RuntimeDapp<TDappState>
  ) => Promise<JumplistListItem<TParams, TDappState>>;
}

export interface JumplistItem {
  key: string;
  icon?: string;
  title: string;
  event?: PlatformEvent;
  colorClass?: string;
  action?: () => void;
}

export interface JumplistListItem<TParams, TDappState> {
  component: any;
  title: string;
  items: (
    params: TParams,
    runtimeDapp: RuntimeDapp<TDappState>
  ) => Promise<JumplistItem>;
}
