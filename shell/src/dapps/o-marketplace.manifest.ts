import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import Home from "./o-marketplace/pages/Home.svelte";
import Categories from "./o-marketplace/pages/Categories.svelte";
import Favorites from "./o-marketplace/pages/Favorites.svelte";
import MyOffers from "./o-marketplace/pages/MyOffers.svelte";
import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
import {shellProcess, ShellProcessContext} from "../shared/processes/shellProcess";
import {tryGetCurrentSafe} from "./o-banking/init";
import {createOffer} from "./o-marketplace/processes/createOffer";

const stream: PageManifest = {
  isDefault: true,
  routeParts: ["stream"],
  component: Home,
  title: "Stream",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};
const categories: PageManifest = {
  isDefault: false,
  routeParts: ["categories"],
  component: Categories,
  title: "Categories",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};
const favorites: PageManifest = {
  isDefault: false,
  routeParts: ["favorites"],
  component: Favorites,
  title: "Favorites",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};
const myOffers: PageManifest = {
  isDefault: false,
  routeParts: ["my-offers"],
  component: MyOffers,
  title: "My offers",
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

export const marketplace: DappManifest<DappState> = {
  dappId: "marketplace:1",
  isSingleton: true,
  dependencies: [],
  isHidden: false,
  icon: faPeopleArrows,
  title: "Marketplace",
  routeParts: ["marketplace"],
  tag: Promise.resolve("alpha"),
  actions: [{
    key: "createOffer",
    label: "Create offer",
    event: (runtimeDapp: RuntimeDapp<any>) => {
      return new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = createOffer;
            ctx.childContext = {
              data: { },
            };
            return ctx;
          }
      );
    },
  }],
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: stream,
      cancelDependencyLoading: false,
    };
  },
  pages: [stream, categories, favorites, myOffers],
};
