import Home from "./o-passport/pages/Home.svelte";
import Account from "./o-passport/pages/Account.svelte";
import Keys from "./o-passport/pages/Keys.svelte";
import Settings from "./o-passport/pages/Settings.svelte";
import Login from "./o-passport/pages/Login.svelte";
import { logout } from "./o-passport/processes/logout";
import ActionButtonComponent from "../shared/molecules/NextNav/Components/ActionButton.svelte";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import LinkComponent from "../shared/molecules/NextNav/Components/Link.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import {push} from "svelte-spa-router";

const index: Page<any, DappState> = {
  routeParts: ["=profile"],
  component: Home,
  title: "Profile",
  type: "page",
};
const profile: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=profile", ":profileId"],
  component: Home,
  title: "Profile",
  type: "page",
};
const account: Page<any, DappState> = {
  routeParts: ["=account"],
  component: Account,
  title: "Accounts",
  type: "page",
};
const keys: Page<any, DappState> = {
  routeParts: ["=keys"],
  component: Keys,
  title: "Keys",
  type: "page",
};
const settings: Page<any, DappState> = {
  routeParts: ["=settings"],
  component: Settings,
  title: "Settings",
  type: "page",
};

// Same as 'index' but accepts a ':code' parameter that will be passed to 'Home'
const login: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=login", ":code"],
  component: Login,
  title: "Login with Circles",
  type: "page",
};

export interface DappState {
  // put state here
}

export const passport: DappManifest<DappState> = {
  type: "dapp",
  dappId: "passport:1",
  isSingleton: true,
  isHidden: false,
  icon: "passport",
  title: "Passport",
  routeParts: ["=passport"],
  tag: Promise.resolve("alpha"),
  jumplist: {
    type: "jumplist",
    title: "Actions",
    isSystem: false,
    routeParts: ["=actions"],
    items: async () => {
      return [
        {
          key: "logout",
          title: "Logout",
          icon: "logout",
          action: () => window.o.runProcess(logout, {}),
        },
      ];
    },
  },
  navigation: {
    navPill: {
      left: {
        component: ListComponent,
        props: {
          icon: "list",
          action: () => {}
        },
      },
      right: {
        component: LinkComponent,
        props: {
          icon: "home",
          action: () => push("#/dashboard")
        },
      },
      center: {
        component: ActionButtonComponent, // action|
        props: {},
      },
    },
  },
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, profile, account, keys, settings, login],
};
