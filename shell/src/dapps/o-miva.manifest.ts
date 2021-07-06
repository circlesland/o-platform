import Home from "./o-miva/pages/Home.svelte";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [""],
  component: Home,
  title: "miva",
  type: "page",
};

export interface DappState {
  // put state here
}

export const miva: DappManifest<DappState> = {
  type: "dapp",
  dappId: "miva:1",
  isSingleton: true,
  isHidden: true,
  icon: "miva",
  title: "Miva",
  routeParts: ["miva"],
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
