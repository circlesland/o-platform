import { writable, derived } from "svelte/store";
import {Offer} from "../../../shared/api/data/types";

export const cartContents = writable<(Offer & {shopId:number})[]>(
  JSON.parse(localStorage.getItem("cartContents"))
);

cartContents.subscribe(
  (value) => (localStorage.cartContents = JSON.stringify(value))
);

export const totalPrice = derived(cartContents, ($cartContents) => {
  let pricePerUnit = 0;
  if ($cartContents) {
    $cartContents.forEach(
      (e) => (pricePerUnit = pricePerUnit + parseFloat(e.pricePerUnit))
    );
  }
  return pricePerUnit;
});
