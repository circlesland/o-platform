import {
  EventPayload,
  EventType,
  ProfileEvent,
  ProfileEventFilter,
  Purchased,
  QueryEventsArgs,
  SortOrder,
} from "../api/data/types";
import {PagedEventQuery, PagedEventQueryIndexEntry} from "./pagedEventQuery";
import {me} from "./me";
import {ApiClient} from "../apiConnection";

export class MyTransactions extends PagedEventQuery {
  constructor(sortOrder:SortOrder, pageSize = 20) {
    super([EventType.CrcHubTransfer, EventType.CrcMinting], sortOrder, pageSize);
  }

  getPrimaryKey(eventPayload: EventPayload): string {
    return (<Purchased>eventPayload).transaction_hash.toString();
  }

  protected getIndexedValues(event: ProfileEvent): PagedEventQueryIndexEntry[] {
    return [{
      indexName: "transaction_hash",
      indexKey: event.transaction_hash
    }];
  }

  async findSingleItemFallback(types: string[], primaryKey: string): Promise<ProfileEvent | undefined> {
    let safeAddress: string;
    me.subscribe(($me) => (safeAddress = $me.circlesAddress))();

    const foundEvents = await ApiClient.query<
      ProfileEvent[],
      QueryEventsArgs
      >(this.query, {
      safeAddress: safeAddress,
      types: <EventType[]>types,
      pagination: {
        order: SortOrder.Desc,
        limit: 1,
        continueAt: new Date().toJSON(),
      },
      filter: <ProfileEventFilter>{
        transactionHash: primaryKey,
      },
    });

    if (foundEvents && foundEvents.length > 0) {
      const event = foundEvents[0];
      this.addToCache(event);
      return event;
    }
  }
}

export const myTransactions = new MyTransactions(SortOrder.Desc);