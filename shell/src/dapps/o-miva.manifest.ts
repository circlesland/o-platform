import Home from "./o-miva/pages/Home.svelte";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "fullnode",
  type: "page",
};

export interface DappState {
  // put state here
}

export const fullnode: DappManifest<DappState> = {
  type: "dapp",
  dappId: "fullnode:1",
  isSingleton: true,
  isHidden: true,
  icon: "fullnode",
  title: "fullnode",
  routeParts: ["=fullnode"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  isFullWidth: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: index,
      cancelDependencyLoading: false,
    };
  },
  routables: [index],
};
