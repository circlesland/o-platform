import Home from "./o-marketplace/pages/Home.svelte";
import ListView from "./o-marketplace/pages/ListView.svelte";
import Locations from "./o-marketplace/pages/Locations.svelte";
import Categories from "./o-marketplace/pages/Categories.svelte";
import OfferDetail from "./o-marketplace/pages/OfferDetail.svelte";
import CategoryDetail from "./o-marketplace/pages/CategoryDetail.svelte";
import Favorites from "./o-marketplace/pages/Favorites.svelte";
import MyOffers from "./o-marketplace/pages/MyOffers.svelte";
import MyCategories from "./o-marketplace/pages/MyCategories.svelte";
import MyPurchases from "./o-marketplace/pages/MyPurchases.svelte";
import ScanPurchase from "./o-marketplace/pages/ScanPurchase.svelte";
import MySales from "./o-marketplace/pages/MySales.svelte";
import MySaleDetail from "./o-marketplace/pages/MySaleDetail.svelte";
import MyPurchasesDetail from "./o-marketplace/pages/MyPurchasesDetail.svelte";
import { Trigger } from "@o-platform/o-interfaces/dist/routables/trigger";
import PleaseSignIn from "./o-marketplace/pages/PleaseSignIn.svelte";
import ShoppingCart from "./o-marketplace/pages/ShoppingCart.svelte";
// import { upsertOffer } from "./o-marketplace/processes/upsertOffer";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { cartContents } from "./o-marketplace/stores/shoppingCartStore";
import { Offer } from "../shared/api/data/types";
import { offers } from "../shared/stores/offers";
import { push } from "svelte-spa-router";
import { me } from "../shared/stores/me";
import CategoryEntryDetail from "./o-marketplace/pages/CategoryEntryDetail.svelte";

const addToCart: Trigger<{ id: Number }, DappState> = {
  isSystem: true,
  routeParts: ["=actions", "=addToCart", ":id", ":shopId"],
  title: "Add to Cart",
  type: "trigger",
  action: async (params) => {
    let offer: Offer & {shopId:number};
    let cart: (Offer & {shopId:number})[] = [];
    let authenticated: boolean = false;
    if (!params.id) {
      return;
    }

    const unsubMe = me.subscribe((o) => {
      if (o) {
        authenticated = true;
      }
    });
    unsubMe();

    if (authenticated) {
      const o = await offers.findById(parseInt(params.id.toString()));

      if (o) {
        offer = {
          ...o,
          shopId:0
        };

        const unsubCart = cartContents.subscribe((o) => {
          cart = o ? o : [];
        });
        unsubCart();

        cartContents.update((o) => (cartContents ? [...cart, offer] : [offer]));
        push(`#/marketplace/cart`);
      } else {
        console.log("offer broken");
      }
    } else {
      console.log("not authenticated");
      push(`#/marketplace/pleasesignin`);
    }
  },
};

const market: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=market", ":shopId"],
  component: Home,
  title: "Market",
  type: "page",
};

const list: Page<any, DappState> = {
  isSystem: true,
  routeParts: ["=list", ":shopId"],
  component: ListView,
  title: "List",
  type: "page",
};

const locations: Page<any, DappState> = {
  routeParts: ["=locations"],
  component: Locations,
  title: "Locations",
  type: "page",
};

const pleaseSignIn: Page<any, DappState> = {
  isSystem: true,
  anonymous: true,
  routeParts: ["=pleasesignin"],
  component: PleaseSignIn,
  title: "Please Sign In",
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
const categoryEntryDetail: Page<any, DappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=detail", ":shopId", ":entryId"],
  component: CategoryEntryDetail,
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
  title: "My Offers",
  type: "page",
};
const myCategories: Page<any, DappState> = {
  routeParts: ["=my-categories"],
  component: MyCategories,
  title: "My Categories",
  type: "page",
};
const myOffersDetail: Page<any, DappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=my-offers", ":id"],
  component: OfferDetail,
  title: "Offer detail",
  type: "page",
};
const myPurchases: Page<any, DappState> = {
  routeParts: ["=my-purchases"],
  component: MyPurchases,
  title: "My purchases",
  type: "page",
};
const scanPurchase: Page<any, DappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=scan-purchase"],
  component: ScanPurchase,
  title: "Scan purchase Code",
  type: "page",
};
const mySales: Page<any, DappState> = {
  routeParts: ["=my-sales"],
  component: MySales,
  title: "My sales",
  type: "page",
};
const myPurchasesDetail: Page<any, DappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=my-purchases", ":id"],
  basePage: ["my-purchases"],
  component: MyPurchasesDetail,
  title: "Purchase Details",
  type: "page",
};
const mySaleDetail: Page<any, DappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=my-sales", ":id"],
  basePage: ["my-sales"],
  component: MySaleDetail,
  title: "Sale Details",
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
  title: "Market",
  routeParts: ["=marketplace"],
  defaultRoute: ["locations"],
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
    locations,
    list,
    market,
    addToCart,
    pleaseSignIn,
    // favorites,
    myOffers,
    myCategories,
    offerDetail,
    // myOffersDetail,
    shoppingCart,
    myPurchases,
    myPurchasesDetail,
    scanPurchase,
    mySales,
    mySaleDetail,
    categoryEntryDetail
  ],
};
