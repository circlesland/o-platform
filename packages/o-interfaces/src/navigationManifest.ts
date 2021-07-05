import {DappManifest} from "./dappManifest";
import {Routable} from "./routable";

export interface NavigationManifest {
  leftSlot?: {
    component: any;
    props: {
      icon: string;
      action: string;
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
      props: {
        icon: string;
        action: string;
      };
    };
    right?: {
      component: any;
      props: {
        icon: string;
        action: string;
        link: string;
      };
    };
    actionButton: {
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


export function getMergedNavigationManifest(dapp: DappManifest<any>, routable:Routable) {
  const mergedManifest = dapp.navigation ?? {};
  const other = routable.navigation;
  if (!other)
    return mergedManifest;

  if (other.leftSlot) {
    mergedManifest.leftSlot = other.leftSlot;
  }
  if (other.navPill) {
    if (!mergedManifest.navPill) {
      mergedManifest.navPill = other.navPill;
    } else {
      if (other.navPill.actionButton) {
        mergedManifest.navPill.actionButton = other.navPill.actionButton;
      }
      if (other.navPill.left) {
        mergedManifest.navPill.left = other.navPill.left;
      }
      if (other.navPill.right) {
        mergedManifest.navPill.right = other.navPill.right;
      }
    }
  }
  if (other.rightSlot) {
    mergedManifest.rightSlot = other.rightSlot;
  }
  if (other.loginPill) {
    mergedManifest.loginPill = other.loginPill;
  }

  return mergedManifest;
}