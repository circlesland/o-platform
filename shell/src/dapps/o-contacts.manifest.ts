import Home from "./o-contacts/pages/Home.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Contacts",
  type: "page",
};

export interface DappState {
  // put state here
}

export const contacts: DappManifest<DappState> = {
  type: "dapp",
  dappId: "contacts:1",
  isSingleton: true,
  icon: "group",
  title: "Contacts",
  routeParts: ["=contacts"],
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
