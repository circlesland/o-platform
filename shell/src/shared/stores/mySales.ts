import {
  CompleteSaleDocument,
  EventPayload,
  EventType,
  ProfileEvent,
  ProfileEventFilter,
  QueryEventsArgs, SaleEvent, SortOrder,
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

  private salesByPickupCode:{[code:string]:ProfileEvent} = {};

  protected maintainExternalCaches(event: ProfileEvent): void {
    const saleEvent = <SaleEvent>event.payload;
    if (!saleEvent.invoice.pickupCode) {
      return;
    }
    this.salesByPickupCode[saleEvent.invoice.pickupCode] = event;
  }

  async findByPickupCode(code: string, reload?: boolean) : Promise<ProfileEvent|null> {
    if (this.salesByPickupCode[code] && !reload){
      return this.salesByPickupCode[code];
    }

    let mySafeAddress = "";
    me.subscribe(($me) => (mySafeAddress = $me.circlesAddress))();

    const foundEvents = await ApiClient.query<ProfileEvent[],
      QueryEventsArgs>(this.query, {
      safeAddress: mySafeAddress,
      types: [EventType.SaleEvent],
      pagination: {
        order: SortOrder.Desc,
        limit: 1,
        continueAt: new Date().toJSON()
      },
      filter: <ProfileEventFilter>{
        sale: {
          pickupCode: code
        }
      },
    });

    if (foundEvents.length == 1) {
      this.addToCache(foundEvents[0]);
      return foundEvents[0];
    }

    return null;
  }

  async completeSale(invoiceId: number) {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const completedInvoice = await apiClient.mutate({
      mutation: CompleteSaleDocument,
      variables: {
        invoiceId: invoiceId,
      },
    });
    if (!completedInvoice.data?.completeSale) {
      throw new Error(window.i18n("shared.stores.sales.errors.couldNotComplete"));
    }
    await this.findSingleItemFallback([EventType.SaleEvent], invoiceId.toString());
    this.refresh();
  }

  async revokeSale(invoiceId: number) {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const completedInvoice = await apiClient.mutate({
      mutation: CompleteSaleDocument,
      variables: {
        invoiceId: invoiceId,
        revoke: true,
      },
    });
    if (!completedInvoice.data?.completeSale) {
      throw new Error(window.i18n("shared.stores.sales.errors.couldNotRevoke"));
    }
    await this.findSingleItemFallback([EventType.SaleEvent], invoiceId.toString());
    this.refresh();
  }
}

export const mySales = new MySales(SortOrder.Desc);
