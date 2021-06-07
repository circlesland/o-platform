import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Home from "./o-trustnetwork/pages/Home.svelte";
import {PageManifest} from "@o-platform/o-interfaces/dist/pageManifest";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

const index : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Trust network",
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

export const trustnetwork : DappManifest<DappState> = {
  dappId: "trustnetwork:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  icon: faPeopleArrows,
  title: "Trust network",
  routeParts: ["trustnetwork"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
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