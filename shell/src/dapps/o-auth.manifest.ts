import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Home from "./o-auth/pages/Home.svelte";
import {PageManifest} from "@o-platform/o-interfaces/dist/pageManifest";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

const index : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Login with Circles",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

// Same as 'index' but accepts a ':code' parameter that will be passed to 'Home'
const exchangeCode : PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: [":code"],
  component: Home,
  title: "Login with Circles",
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

export const auth : DappManifest<DappState> = {
  dappId: "auth:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  hideFooter: true,
  icon: faPeopleArrows,
  title: "Circles authentication",
  routeParts: ["login"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  actions: [],
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: index,
      cancelDependencyLoading: false
    };
  },
  pages: [index, exchangeCode]
};