import { DappManifest } from "./dappManifest";
import { Routable } from "./routable";
import { merge } from "rxjs";

export interface NavigationManifest {
  leftSlot?: {
    component: any;
    props: {
      icon: string;
      action: {
        type: string;
        target: string;
      };
    };
  };
  rightSlot?: {
    component: any;
    props: {
      icon: string;
    };
  };
  navPill?: {
    left?: {
      component: any;
      props?: {
        icon?: string;
        text?: string;
        action: {
          type: string;
          target: string;
        };
      };
    };
    right?: {
      component: any;
      props?: {
        icon?: string;
        text?: string;
        action: {
          type: string;
          target: string;
        };
      };
    };
    actionButton?: {
      component: any;
      props: {
        disabled: boolean;
      };
    };
  };
  loginPill?: {
    isOpen: false;
    actionButton: {
      component: any;
      props: {
        disabled: false;
      };
    };
  };
}

export function getMergedNavigationManifest(
  dapp: DappManifest<any>,
  routable: Routable
) {
  const other = routable?.navigation;
  if (!other) return dapp.navigation;

  let mergedManifest: NavigationManifest = {};
  mergedManifest.leftSlot = other.leftSlot ?? dapp.navigation?.leftSlot;
  mergedManifest.rightSlot = other.rightSlot ?? dapp.navigation?.rightSlot;
  mergedManifest.navPill = {
    left: other.navPill?.left ?? dapp.navigation?.navPill?.left,
    actionButton:
      other.navPill?.actionButton ?? dapp.navigation?.navPill?.actionButton,
    right: other.navPill?.right ?? dapp.navigation?.navPill?.right,
  };
  mergedManifest.loginPill = other.loginPill ?? dapp.navigation?.loginPill;

  return mergedManifest;
}
