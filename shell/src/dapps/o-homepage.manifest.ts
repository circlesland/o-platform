import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Home from "./o-homepage/pages/Home.svelte";
import {PageManifest} from "@o-platform/o-interfaces/dist/pageManifest";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

const index : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Circles Land",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};


export interface DappState {
  // put state here
}

export const homepage : DappManifest<DappState> = {
  dappId: "homepage:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  icon: faPeopleArrows,
  title: "Circles Land",
  routeParts: [],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  isFullWidth: true,
  actions: [],
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: index,
      cancelDependencyLoading: false
    };
  },
  pages: [index]
};