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
        shop: await ApiClient.query<Shop & {
          owner: {
            id
            name
            avatarUrl
            circlesAddress
          }
        }[], ShopQueryVariables>(ShopDocument, {
          id: parseInt(shopId.toString()),
        }),
        items: await orderItems(shopIds[shopId]),
        total: getShopTotal(shopIds[shopId]),
      };
    })
  );
  return shops;
});

// export const cartContentsByShop = derived(cartContents, async ($cartContents) => {

//   const shopIds = $cartContents.groupBy((o) => o.shopId);

//   let shops: [] = [];
//   await Object.keys(shopIds) // get the keys as array
//     .forEach(async function (key) {
//       const myShop = await ApiClient.query<Shop[], ShopQueryVariables>(ShopDocument, {
//         id: parseInt(key.toString()),
//       });
//       shops[key] = { shop: myShop, items: orderItems(shopIds[key]) };
//     });
//   return shops;
// });

function getShopTotal(items) {
  let pricePerUnit = 0;
  items.forEach((e) => (pricePerUnit = pricePerUnit + parseFloat(e.pricePerUnit)));
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
  console.log("INB ORDER ITEMS: ", items);
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
    return {
      offerId: o.id,
      title: o.title,
      description: o.description,
      pictureUrl: o.pictureUrl,
      pricePerUnit: parseFloat(o.pricePerUnit),
      version: o.version,
      qty: orderedCart[o.id].qty,
      total: orderedCart[o.id].qty * parseFloat(o.pricePerUnit),
      shopId: orderedCart[o.id].shopId,
      sellerAddress: o.createdByAddress,
    };
  });

  return shoppingCartOffers;
}

export const subtotal = derived(cartContents, ($cartContents) => {
  let pricePerUnit = 0;
  if ($cartContents) {
    $cartContents.forEach((e) => (pricePerUnit = pricePerUnit + parseFloat(e.pricePerUnit)));
  }
  return pricePerUnit;
});

export const totalPrice = derived(cartContents, ($cartContents) => {
  let pricePerUnit = 0;
  if ($cartContents) {
    $cartContents.forEach((e) => (pricePerUnit = pricePerUnit + parseFloat(e.pricePerUnit)));
  }
  return pricePerUnit;
});
