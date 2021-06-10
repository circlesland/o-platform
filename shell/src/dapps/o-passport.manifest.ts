import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import Home from "./o-passport/pages/Home.svelte";
import Account from "./o-passport/pages/Account.svelte";
import Keys from "./o-passport/pages/Keys.svelte";
import Settings from "./o-passport/pages/Settings.svelte";
import Login from "./o-passport/pages/Login.svelte";
import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { logout } from "./o-passport/processes/logout";
import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
import {
  shellProcess,
  ShellProcessContext,
} from "../shared/processes/shellProcess";

const index: PageManifest = {
  isDefault: true,
  routeParts: ["profile"],
  component: Home,
  title: "Profile",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};
const profile: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["profile", ":profileId"],
  component: Home,
  title: "Profile",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const account: PageManifest = {
  isDefault: false,
  routeParts: ["account"],
  component: Account,
  title: "Accounts",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const keys: PageManifest = {
  isDefault: false,
  routeParts: ["keys"],
  component: Keys,
  title: "Keys",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const settings: PageManifest = {
  isDefault: false,
  routeParts: ["settings"],
  component: Settings,
  title: "Settings",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

// Same as 'index' but accepts a ':code' parameter that will be passed to 'Home'
const login: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["login", ":code"],
  component: Login,
  title: "Login with Circles",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

export interface DappState {
  // put state here
}

export const passport: DappManifest<DappState> = {
  dappId: "passport:1",
  isSingleton: true,
  dependencies: [],
  isHidden: false,
  icon: faPeopleArrows,
  title: "Passport",
  routeParts: ["passport"],
  tag: Promise.resolve("alpha"),
  actions: [
    {
      key: "logout",
      label: "Logout",
      icon: "logout",
      event: () => {
        return new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = logout;
            return ctx;
          }
        );
      },
    },
  ],
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: index,
      cancelDependencyLoading: false,
    };
  },
  pages: [index, profile, account, keys, settings, login],
};
