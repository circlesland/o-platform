import {
  AggregateType,
  CompletePurchaseDocument, CompletePurchaseMutationVariables,
  EventPayload,
  EventType, Invoice,
  ProfileEvent,
  ProfileEventFilter,
  Purchased, Purchases,
  QueryEventsArgs,
  SortOrder,
} from "../api/data/types";
import {PagedEventQuery, PagedEventQueryIndexEntry} from "./pagedEventQuery";
import {me} from "./me";
import {ApiClient} from "../apiConnection";

export class MyPurchases extends PagedEventQuery {
  constructor(sortOrder: SortOrder, pageSize = 20) {
    super([EventType.Purchased], sortOrder, pageSize);
  }

  getPrimaryKey(eventPayload: EventPayload): string {
    return (<Purchased>eventPayload).purchase.id.toString();
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
      types: [EventType.Purchased],
      pagination: {
        order: SortOrder.Desc,
        limit: 1,
        continueAt: new Date().toJSON()
      },
      filter: <ProfileEventFilter>{
        purchased: {
          id: parseInt(primaryKey)
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

  async completePurchase(invoiceId: number) {
    const completedInvoice = await ApiClient.mutate<Invoice, CompletePurchaseMutationVariables>(CompletePurchaseDocument, {
      invoiceId: invoiceId
    });
    await this.findSingleItemFallback([AggregateType.Purchases], completedInvoice.purchaseId.toString());
    this.refresh();
  }

  async revokeCompletionStatus(invoiceId: number) {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const completedInvoice = await apiClient.mutate({
      mutation: CompletePurchaseDocument,
      variables: {
        invoiceId: invoiceId,
        revoke: true
      }
    });
    if (!completedInvoice.data?.completePurchase) {
      throw new Error(window.i18n("shared.stores.purchases.errors.couldNotRevoke"));
    }

    await this.findSingleItemFallback([AggregateType.Purchases], completedInvoice.data.purchase.id);
    this.refresh();
  }
}

export const myPurchases = new MyPurchases(SortOrder.Desc);