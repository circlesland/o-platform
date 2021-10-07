import Home from "./o-dashboard/pages/Home.svelte";
import Invites from "./o-dashboard/pages/Invites.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Dashboard",
  type: "page",
};
const invites: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=invites"],
  component: Invites,
  title: "Invites",
  position: "modal",
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

  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index, invites],
};
