import { writable, derived } from "svelte/store";
import { Offer } from "../../../shared/api/data/types";
import { Shop, ShopDocument, ShopQueryVariables } from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";

export const cartContents = writable<(Offer & { shopId: number })[]>(JSON.parse(localStorage.getItem("cartContents")));

cartContents.subscribe((value) => (localStorage.cartContents = JSON.stringify(value)));

export const cartContentsByShop = derived(cartContents, async ($cartContents) => {
  const shopIds = $cartContents.groupBy((o) => o.shopId);

  let shops = await Promise.all(
    Object.keys(shopIds).map(async (shopId) => {
      return {
        shop: await ApiClient.query<Shop[], ShopQueryVariables>(ShopDocument, {
          id: parseInt(shopId.toString()),
        }),
        items: orderItems(shopIds[shopId]),
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

// Flatten Items into quantity by count.
function orderItems(items) {
  const orderedCart = {};
  items.forEach((item) => {
    orderedCart[item.id] = {
      shopId: item.shopId,
      item: item,
      qty: orderedCart[item.id] ? orderedCart[item.id].qty + 1 : 1,
    };
  });

  return Object.entries(orderedCart).map(([id, item]) => ({ id, item }));
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
