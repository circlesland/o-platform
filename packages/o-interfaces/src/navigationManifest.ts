import { DappManifest } from "./dappManifest";
import { Routable } from "./routable";
import { merge } from "rxjs";

export interface NavigationProps {
  icon?: string;
  text?: string;
  action?: () => void;
}

export interface NavigationElement {
  isActive?: boolean;
  component: any;
  props: NavigationProps;
}

export interface NavigationManifest {
  leftSlot?: NavigationElement;
  rightSlot?: NavigationElement;
  navPill?: {
    left?: NavigationElement;
    right?: NavigationElement;
    center?: NavigationElement;
  };
  loginPill?: boolean;
}