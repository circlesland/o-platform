import Home from "./o-marketplace/pages/Home.svelte";
import Categories from "./o-marketplace/pages/Categories.svelte";
import OfferDetail from "./o-marketplace/pages/OfferDetail.svelte";
import CategoryDetail from "./o-marketplace/pages/CategoryDetail.svelte";
import Favorites from "./o-marketplace/pages/Favorites.svelte";
import MyOffers from "./o-marketplace/pages/MyOffers.svelte";
import MyPurchases from "./o-marketplace/pages/MyPurchases.svelte";
import ShoppingCart from "./o-marketplace/pages/ShoppingCart.svelte";
// import { upsertOffer } from "./o-marketplace/processes/upsertOffer";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

const market: Page<any, DappState> = {
  routeParts: ["=market"],
  component: Home,
  title: "Market",
  type: "page",
};
const offerDetail: Page<any, DappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=offer", ":id"],
  component: OfferDetail,
  title: "Offer detail",
  type: "page",
};
const shoppingCart: Page<any, DappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=cart"],
  component: ShoppingCart,
  title: "Cart",
  type: "page",
};
const categories: Page<any, DappState> = {
  routeParts: ["=categories"],
  component: Categories,
  title: "Categories",
  type: "page",
};
const categoryDetail: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=categories", ":category", ":categoryName"],
  position: "main",
  component: CategoryDetail,
  title: "Category",
  type: "page",
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
const myPurchases: Page<any, DappState> = {
  routeParts: ["=my-purchases"],
  component: MyPurchases,
  title: "My purchases",
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
  defaultRoute: ["market"],
  tag: Promise.resolve("alpha"),
  // jumplist: {
  //   type: "jumplist",
  //   title: "Actions",
  //   isSystem: false,
  //   routeParts: ["=actions"],
  //   items: async () => [
  //     {
  //       key: "createOffer",
  //       title: "Create offer",
  //       icon: "add",
  //       //action: () => window.o.runProcess(upsertOffer, {}),
  //     },
  //   ],
  // },
  isEnabled: true,
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    return {
      initialRoutable: market,
      cancelDependencyLoading: false,
    };
  },
  routables: [
    market,
    favorites,
    myOffers,
    offerDetail,
    shoppingCart,
    myPurchases,
  ],
};
