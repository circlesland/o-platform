import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Home from "./o-stats/pages/Home.svelte";
import MyRank from "./o-stats/pages/MyRank.svelte";
import Citites from "./o-stats/pages/Cities.svelte";
import Countries from "./o-stats/pages/Countries.svelte";
import {PageManifest} from "@o-platform/o-interfaces/dist/pageManifest";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

const index : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Statistics",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

// My invite rank in my city
const myCityRank : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["my-rank"],
  component: MyRank,
  title: "My rank",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const cityRanks : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["cities"],
  component: Citites,
  title: "Citites",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const countryRanks : PageManifest = {
  isDefault: true,
  isSystem: true,
  routeParts: ["countries"],
  component: Countries,
  title: "Countries",
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

export const stats : DappManifest<DappState> = {
  dappId: "stats:1",
  isSingleton: true,
  dependencies: [],
  isHidden: true,
  icon: faPeopleArrows,
  title: "Statistics",
  routeParts: ["stats"],
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
  pages: [index, myCityRank, cityRanks, countryRanks]
};