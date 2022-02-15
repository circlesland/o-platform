import { writable, readable, derived } from "svelte/store";

export const cartContents = writable(
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
