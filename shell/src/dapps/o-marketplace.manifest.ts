import Home from "./o-marketplace/pages/Home.svelte";
import Categories from "./o-marketplace/pages/Categories.svelte";
import OfferDetail from "./o-marketplace/pages/OfferDetail.svelte";
import CategoryDetail from "./o-marketplace/pages/CategoryDetail.svelte";
import Favorites from "./o-marketplace/pages/Favorites.svelte";
import MyOffers from "./o-marketplace/pages/MyOffers.svelte";
import { upsertOffer } from "./o-marketplace/processes/upsertOffer";
import ActionButtonComponent from "../shared/molecules/NextNav/Components/ActionButton.svelte";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import LinkComponent from "../shared/molecules/NextNav/Components/Link.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import {push} from "svelte-spa-router";

const stream: Page<any, DappState> = {
  routeParts: ["=stream"],
  component: Home,
  title: "Stream",
  type: "page",
};
const offerDetail: Page<any, DappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=offer", ":id"],
  component: OfferDetail,
  title: "Offer detail",
  type: "page",
  navigation: {
    navPill: {
      left: {
        component: LinkComponent,
        props: {
          text: "Back",
          action: () => history.back(),
        },
      },
    },
  },
};
const categories: Page<any, DappState> = {
  routeParts: ["=categories"],
  component: Categories,
  title: "Categories",
  type: "page",
  navigation: {
    navPill: {
      left: {
        component: LinkComponent,
        props: {
          text: "Back",
          action: () => history.back(),
        },
      },
    },
  },
};
const categoryDetail: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=categories", ":category", ":categoryName"],
  position: "modal",
  component: CategoryDetail,
  title: "Category",
  type: "page",
  navigation: {
    navPill: {
      left: {
        component: LinkComponent,
        props: {
          text: "Back",
          action: () => history.back(),
        },
      },
    },
  },
};
const favorites: Page<any, DappState> = {
  routeParts: ["=favorites"],
  component: Favorites,
  title: "Favorites",
  type: "page",
};
const myOffers: Page<any, DappState> = {
  routeParts: ["=my-offers"],
  component: MyOffers,
  title: "My offers",
  type: "page",
};

export interface DappState {
  // put state here
}

export const marketplace: DappManifest<DappState> = {
  type: "dapp",
  dappId: "marketplace:1",
  isSingleton: true,
  isHidden: false,
  icon: "marketplace",
  title: "Marketplace",
  routeParts: ["=marketplace"],
  tag: Promise.resolve("alpha"),
  jumplist: {
    type: "jumplist",
    title: "Actions",
    isSystem: false,
    routeParts: ["=actions"],
    items: () => [
      {
        key: "createOffer",
        title: "Create offer",
        icon: "createoffer",
        action: () => window.o.runProcess(upsertOffer, {}),
      },
    ],
  },
  isEnabled: true,
  navigation: {
    navPill: {
      left: {
        component: ListComponent,
        props: {
          icon: "list",
          action: () => {},
        },
      },
      right: {
        component: LinkComponent,
        props: {
          icon: "home",
          action: () => push("#/dashboard")
        },
      },
      center: {
        component: ActionButtonComponent, // action|
        props: { },
      },
    },
  },
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: stream,
      cancelDependencyLoading: false,
    };
  },
  routables: [
    stream,
    categories,
    favorites,
    myOffers,
    offerDetail,
    categoryDetail,
  ],
};
