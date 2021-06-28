import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import Home from "./o-marketplace/pages/Home.svelte";
import Categories from "./o-marketplace/pages/Categories.svelte";
import OfferDetail from "./o-marketplace/pages/OfferDetail.svelte";
import CategoryDetail from "./o-marketplace/pages/CategoryDetail.svelte";
import Favorites from "./o-marketplace/pages/Favorites.svelte";
import MyOffers from "./o-marketplace/pages/MyOffers.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
import {
  shellProcess,
  ShellProcessContext,
} from "../shared/processes/shellProcess";
import { upsertOffer } from "./o-marketplace/processes/upsertOffer";
import ActionButtonComponent from "../shared/molecules/NextNav/Components/ActionButton.svelte";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import LinkComponent from "../shared/molecules/NextNav/Components/Link.svelte";

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
const offerDetail: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["offer", ":id"],
  component: OfferDetail,
  title: "Offer detail",
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
const categoryDetail: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["offers", ":category"],
  component: CategoryDetail,
  title: "Category detail",
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
  actions: () => [
    {
      key: "createOffer",
      label: "Create offer",
      icon: "createoffer",
      event: () => {
        return new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = upsertOffer;
            ctx.childContext = {
              data: {},
            };
            return ctx;
          }
        );
      },
    },
  ],
  isEnabled: true,
  navigation: {
    navPill: {
      left: {
        component: ListComponent,
        props: {
          icon: "list",
          action: "dappsList",
        },
      },
      right: {
        component: LinkComponent,
        props: {
          icon: "home",
          action: "link",
          link: "#/dashboard",
        },
      },
      actionButton: {
        component: ActionButtonComponent, // action|
        props: {
          disabled: false,
        },
      },
    },
  },
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialPage: stream,
      cancelDependencyLoading: false,
    };
  },
  pages: [stream, categories, favorites, myOffers, offerDetail, categoryDetail],
};
