import Home from "./o-stats/pages/Home.svelte";
import MyRank from "./o-stats/pages/MyRank.svelte";
import Citites from "./o-stats/pages/Cities.svelte";
import Countries from "./o-stats/pages/Countries.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

const index: Page<any, DappState> = {
  isSystem: true,
  routeParts: [],
  component: Home,
  title: "Statistics",
  type: "page",
};

// My invite rank in my city
const myCityRank: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=my-rank"],
  component: MyRank,
  title: "My rank",
  type: "page",
};

const cityRanks: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=cities"],
  component: Citites,
  title: "Citites",
  type: "page",
};

const countryRanks: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=countries"],
  component: Countries,
  title: "Countries",
  type: "page",
};

export interface DappState {
  // put state here
}

export const stats: DappManifest<DappState> = {
  type: "dapp",
  dappId: "stats:1",
  isSingleton: true,
  isHidden: true,
  icon: "stats",
  title: "Statistics",
  routeParts: ["=stats"],
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
  routables: [index, myCityRank, cityRanks, countryRanks],
  //pages: [index, myCityRank, cityRanks, countryRanks]
};
