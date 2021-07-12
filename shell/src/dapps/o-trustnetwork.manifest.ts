import Home from "./o-trustnetwork/pages/Home.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Trust network",
  type: "page",
};

export interface DappState {
  // put state here
}

export const trustnetwork: DappManifest<DappState> = {
  type: "dapp",
  dappId: "trustnetwork:1",
  isSingleton: true,
  isHidden: true,
  icon: "network",
  title: "Trust network",
  routeParts: ["=trustnetwork"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  //actions: () => [],
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index],
};
