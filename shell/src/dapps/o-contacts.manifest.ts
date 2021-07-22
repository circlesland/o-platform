import Home from "./o-contacts/pages/Home.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import Graph from "./o-contacts/pages/Graph.svelte";

const index: Page<any, DappState> = {
  routeParts: [],
  component: Graph,
  title: "Network",
  icon: "network",
  type: "page",
};
export interface DappState {
  // put state here
}

export const contacts: DappManifest<DappState> = {
  type: "dapp",
  dappId: "friends:1",
  isSingleton: true,
  icon: "group",
  title: "Friends",
  routeParts: ["=friends"],
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
  routables: [index],
};
