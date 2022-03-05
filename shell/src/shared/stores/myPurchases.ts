import {
  EventPayload,
  EventType, ProfileEvent,
  Purchased,
  SortOrder,
} from "../api/data/types";
import {PagedEventQuery, PagedEventQueryIndexEntry} from "./pagedEventQuery";

export class MyPurchases extends PagedEventQuery {
  constructor(sortOrder:SortOrder, pageSize = 20) {
    super([EventType.Purchased], sortOrder, pageSize);
  }

  getPrimaryKey(eventPayload: EventPayload): string {
    return (<Purchased>eventPayload).purchase.id.toString();
  }

  protected getIndexedValues(event: ProfileEvent): PagedEventQueryIndexEntry[] {
    return [];
  }
}

export const myPurchases = new MyPurchases(SortOrder.Desc);