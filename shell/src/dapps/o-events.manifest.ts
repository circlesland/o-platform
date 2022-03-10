import Event from "./o-events/pages/Event.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { push } from "svelte-spa-router";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  anonymous: true,
  component: Event,
  title: "Event",
  type: "page",
};

export interface DappState {
  // put state here
}

export const events: DappManifest<DappState> = {
  type: "dapp",
  dappId: "events:1",
  noAuthentication: true,
  isSingleton: true,
  anonymous: true,
  isHidden: true,
  icon: "home",
  title: "Circles Land Events",
  routeParts: ["events"],
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
