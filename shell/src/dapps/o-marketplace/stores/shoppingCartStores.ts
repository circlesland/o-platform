import { writable } from "svelte/store";
import { Offer } from "../../../shared/api/data/types";

interface ShoppingCart {
  circlesAddress: string;
  items: [{ amount: string; item: Offer }];
  email: string;
  username: string;
}

export const shoppingCart = writable<ShoppingCart>(
  JSON.parse(localStorage.getItem("shoppingCart"))
);

shoppingCart.subscribe(
  (value) => (localStorage.shoppingCart = JSON.stringify(value))
);

export const enabled = writable<boolean>(localStorage.enabled === "true");

enabled.subscribe((value) => (localStorage.enabled = String(value)));
