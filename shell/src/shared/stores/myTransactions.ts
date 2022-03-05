import {EventPayload, EventType, ProfileEvent, Purchased, SortOrder,} from "../api/data/types";
import {PagedEventQuery, PagedEventQueryIndexEntry} from "./pagedEventQuery";

export class MyTransactions extends PagedEventQuery {
  constructor(sortOrder:SortOrder, pageSize = 20) {
    super([EventType.CrcHubTransfer, EventType.CrcMinting], sortOrder, pageSize);
  }

  getPrimaryKey(eventPayload: EventPayload): string {
    return (<Purchased>eventPayload).transaction_hash.toString();
  }

  protected getIndexedValues(event: ProfileEvent): PagedEventQueryIndexEntry[] {
    return [];
  }
}

export const myTransactions = new MyTransactions(SortOrder.Desc);