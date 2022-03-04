import {
  EventType,
  Purchased,
  SortOrder,
} from "../api/data/types";
import {ScrollWindowQuery} from "./scrollWindowQuery";

export const myPurchases = new ScrollWindowQuery<Purchased>(
  EventType.Purchased,
  SortOrder.Desc,
  25,
  "timestamp",
  (e) => e.purchase.id.toString()
);
