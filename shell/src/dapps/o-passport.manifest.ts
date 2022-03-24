import Home from "./o-passport/pages/Home.svelte";
import Account from "./o-passport/pages/Account.svelte";
import VerifyEmail from "./o-passport/pages/VerifyEmail.svelte";

import Settings from "./o-passport/pages/Settings.svelte";
import Login from "./o-passport/pages/Login.svelte";
import { logout } from "./o-passport/processes/logout";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { Trigger } from "@o-platform/o-interfaces/dist/routables/trigger";
import { loadProfile } from "./o-passport/processes/identify/services/loadProfile";
import { ContactsDappState } from "./o-contacts.manifest";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";

const index: Page<any, DappState> = {
  routeParts: ["=profile"],
  component: Home,
  title: "Profile",
  type: "page",
};

const verifyEmail: Page<any, DappState> = {
  isSystem: true,
  anonymous: true,
  routeParts: ["=verifyEmail", "verify", ":secret"],
  component: VerifyEmail,
  title: "Email address",
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
  routeParts: ["=accounts"],
  component: Account,
  title: "Accounts",
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

const logmeout: Trigger<{}, DappState> = {
  isSystem: true,
  anonymous: true,
  routeParts: ["=actions", "=logout"],
  title: "Log Out",
  type: "trigger",
  action: async (params) => {
    window.o.runProcess(logout, {});
  },
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
  defaultRoute: ["passport"],
  tag: Promise.resolve("alpha"),
  jumplist: {
    type: "jumplist",
    title: "Actions",
    isSystem: false,
    routeParts: ["=actions"],
    items: async () => {
      let items = [
        {
          key: "logout",
          title: "Logout",
          icon: "logout",
          action: () => {
            window.o.runProcess(logout, {});
          },
        },
      ];

      const myProfile = await loadProfile();
      let organisations: any;

      const switcherMyProfile = {
        key: "logout",
        title: myProfile.displayName,
        avatar: myProfile,
        action: () => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.authenticated",
            profile: myProfile,
          });
        },
      };

      if (myProfile.memberships && myProfile.memberships.length > 0) {
        const myMemberships = myProfile.memberships
          //.filter((o) => o.isAdmin)
          .map((o) => o.organisation);
        organisations = <any>[switcherMyProfile, ...myMemberships].map((o) => {
          return {
            key: "orga",
            title: o.displayName,
            avatar: o,
            action: () => {
              window.o.publishEvent(<PlatformEvent>{
                type: "shell.authenticated",
                profile: o,
              });
            },
          };
        });
      }

      return [items, ...organisations];
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
  routables: [index, profile, account, settings, login, verifyEmail, logmeout],
};
