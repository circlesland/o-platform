import Home from "./o-dashboard/pages/Home.svelte";
import CreateHub from "./o-dashboard/pages/CreateHub.svelte";
import { logout } from "./o-passport/processes/logout";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Dashboard",
  type: "page",
};
const createHub: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=become-a-hub"],
  component: CreateHub,
  title: "Become a hub",
  type: "page",
};

export interface DappState {
  // put state here
}

export const dashboard: DappManifest<DappState> = {
  type: "dapp",
  dappId: "dashboard:1",
  isSingleton: true,
  isHidden: true,
  icon: "dashboard",
  title: "Dashboard",
  routeParts: ["=dashboard"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  jumplist: {
    type: "jumplist",
    title: "Actions",
    isSystem: false,
    routeParts: ["=actions"],
    items: async  (params, runtimeDapp) => {
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

  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, createHub],
};
