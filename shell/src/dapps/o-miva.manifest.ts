import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import Home from "./o-miva/pages/Home.svelte";
import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

const index: PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: [""],
  component: Home,
  title: "miva",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

export interface DappState {
  // put state here
}

export const miva: DappManifest<DappState> = {
  dappId: "miva:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  icon: faPeopleArrows,
  title: "Miva",
  routeParts: ["miva"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  hideFooter: true,
  isFullWidth: true,
  actions: () => [],
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: index,
      cancelDependencyLoading: false,
    };
  },
  pages: [index],
};
