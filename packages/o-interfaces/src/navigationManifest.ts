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
  loginPill?: NavigationElement;
}

export function getMergedNavigationManifest(
  dapp: DappManifest<any>,
  routable: Routable,
  processNav?: {
    canSkip: boolean;
    canGoBack: boolean;
    canSubmit: boolean;
  }
) {
  const other = routable?.navigation;
  if (!other) return dapp.navigation;

  let mergedManifest: NavigationManifest = {};
  mergedManifest.leftSlot = other.leftSlot ?? dapp.navigation?.leftSlot;
  mergedManifest.rightSlot = other.rightSlot ?? dapp.navigation?.rightSlot;
  mergedManifest.navPill = {
    left: other.navPill?.left ?? dapp.navigation?.navPill?.left,
    center: other.navPill?.center ?? dapp.navigation?.navPill?.center,
    right: other.navPill?.right ?? dapp.navigation?.navPill?.right,
  };
  mergedManifest.loginPill = other.loginPill ?? dapp.navigation?.loginPill;

  return mergedManifest;
}
