import { writable, derived } from "svelte/store";
import {
  Offer,
  OfferByIdAndVersionInput,
  OffersByIdAndVersionDocument,
  QueryOffersByIdAndVersionArgs,
} from "../../../shared/api/data/types";
import { Shop, ShopDocument, ShopQueryVariables } from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";
import { ShoppingCartItem } from "../types/ShoppingCartItem";

export const cartContents = writable<(Offer & { shopId: number })[]>(JSON.parse(localStorage.getItem("cartContents")));

cartContents.subscribe((value) => (localStorage.cartContents = JSON.stringify(value)));

export const cartContentsByShop = derived(cartContents, async ($cartContents) => {
  const shopIds = $cartContents.groupBy((o) => o.shopId);

  const shops = await Promise.all(
    Object.keys(shopIds).map(async (shopId) => {
      return {
        shop: await ApiClient.query<
          Shop &
            {
              owner: {
                id;
                name;
                avatarUrl;
                circlesAddress;
              };
            }[],
          ShopQueryVariables
        >(ShopDocument, {
          id: parseInt(shopId.toString()),
        }),
        items: await orderItems(shopIds[shopId]),
        total: await getShopTotal(shopIds[shopId]),
      };
    })
  );
  return shops;
});

async function getShopTotal(items) {
  const orderItem = await orderItems(items);
  let pricePerUnit = 0;
  orderItem.forEach((e) => (pricePerUnit = pricePerUnit + e.pricePerUnit * e.qty));
  return pricePerUnit;
}

/*
  offerId: number;
  shopId: number;
  qty: number;
  version: number;
  title: string;
  pictureUrl?: string;
  description?: string;
  pricePerUnit?: number;
*/
// Flatten Items into quantity by count.
async function orderItems(items) {
  const orderedCart: { [x: string]: ShoppingCartItem & { item: Offer } } = {};

  items.forEach((item) => {
    orderedCart[item.id] = {
      offerId: item.id,
      version: item.version,
      shopId: item.shopId,
      item: item,
      qty: orderedCart[item.id] && orderedCart[item.id].qty ? orderedCart[item.id].qty + 1 : 1,
    };
  });

  const offers: Offer[] = await ApiClient.query<Offer[], QueryOffersByIdAndVersionArgs>(OffersByIdAndVersionDocument, {
    query: Object.values(orderedCart).map((o) => {
      return <OfferByIdAndVersionInput>{
        offerId: o.offerId,
        offerVersion: o.version,
      };
    }),
  });
  const shoppingCartOffers: ShoppingCartItem[] = offers.map((o) => {
    const quantity = o.currentInventory
      ? orderedCart[o.id].qty > o.currentInventory
        ? o.currentInventory
        : orderedCart[o.id].qty
      : orderedCart[o.id].qty + 1;
    return {
      offerId: o.id,
      title: o.title,
      description: o.description,
      pictureUrl: o.pictureUrl,
      pricePerUnit: parseFloat(o.pricePerUnit),
      version: o.version,
      qty: quantity,
      total: quantity * parseFloat(o.pricePerUnit),
      shopId: orderedCart[o.id].shopId,
      sellerAddress: o.createdByAddress,
      currentInventory: o.currentInventory,
    };
  });

  return shoppingCartOffers;
}

export const totalPrice = derived(cartContents, ($cartContents) => {
  let pricePerUnit = 0;
  if ($cartContents) {
    $cartContents.forEach((e) => (pricePerUnit = pricePerUnit + parseFloat(e.pricePerUnit)));
  }
  return pricePerUnit;
});
