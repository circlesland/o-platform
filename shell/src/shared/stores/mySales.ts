import {
  AggregateType,
  CompletePurchaseDocument,
  EventPayload,
  EventType,
  ProfileEvent,
  ProfileEventFilter,
  Purchased, Purchases,
  QueryEventsArgs, SaleEvent,
  SortOrder,
} from "../api/data/types";
import {PagedEventQuery, PagedEventQueryIndexEntry} from "./pagedEventQuery";
import {me} from "./me";
import {ApiClient} from "../apiConnection";

export class MySales extends PagedEventQuery {
  constructor(sortOrder: SortOrder, pageSize = 20) {
    super([EventType.SaleEvent], sortOrder, pageSize);
  }

  getPrimaryKey(eventPayload: EventPayload): string {
    return (<SaleEvent>eventPayload).invoice.id.toString();
  }

  protected getIndexedValues(event: ProfileEvent): PagedEventQueryIndexEntry[] {
    return [];
  }

  async findSingleItemFallback(types: string[], primaryKey: string): Promise<ProfileEvent | undefined> {
    let safeAddress: string;
    me.subscribe(($me) => (safeAddress = $me.circlesAddress))();

    const foundEvents = await ApiClient.query<ProfileEvent[],
      QueryEventsArgs>(this.query, {
      safeAddress: safeAddress,
      types: [EventType.SaleEvent],
      pagination: {
        order: SortOrder.Desc,
        limit: 1,
        continueAt: new Date().toJSON()
      },
      filter: <ProfileEventFilter>{
        sale: {
          invoiceId: parseInt(primaryKey)
        }
      },
    });

    if (foundEvents && foundEvents.length > 0) {
      const event = foundEvents[0];
      this.addToCache(event);
      return event;
    }
  }

  protected maintainExternalCaches(event: ProfileEvent): void {
  }
}

export const mySales = new MySales(SortOrder.Desc);