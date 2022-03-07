import {
  EventPayload,
  EventType,
  Profile,
  ProfileEvent,
  ProfileEventFilter,
  QueryEventsArgs,
  SortOrder,
} from "../api/data/types";
import {PagedEventQuery, PagedEventQueryIndexEntry} from "./pagedEventQuery";
import {myPurchases} from "./myPurchases";
import {myTransactions} from "./myTransactions";
import {me} from "./me";

export class MyChat extends PagedEventQuery {
  constructor(withCirclesAddress:string, sortOrder:SortOrder, pageSize = 20) {
    super([
      EventType.CrcHubTransfer,
      EventType.CrcTrust,
      EventType.ChatMessage,
      EventType.Erc20Transfer,
      EventType.Purchased,
      EventType.SaleEvent,
      EventType.InvitationRedeemed
    ], sortOrder, pageSize, <ProfileEventFilter>{
      with: withCirclesAddress
    });
  }

  getPrimaryKey(eventPayload: EventPayload): string {
    switch (eventPayload.__typename) {
      case EventType.CrcHubTransfer: return eventPayload.transaction_hash;
      case EventType.CrcTrust: return eventPayload.transaction_hash;
      case EventType.ChatMessage: return eventPayload.id.toString();
      case EventType.Erc20Transfer: return eventPayload.transaction_hash;
      case EventType.Purchased: return eventPayload.purchase.id.toString();
      case EventType.SaleEvent: return eventPayload.invoice.id.toString();
      case EventType.InvitationRedeemed: return eventPayload.transaction_hash;
    }
    throw new Error(`Unknown event payload: ${eventPayload.__typename}`);
  }

  protected getIndexedValues(event: ProfileEvent): PagedEventQueryIndexEntry[] {
    return [];
  }

  async findSingleItemFallback(types: string[], primaryKey: string): Promise<ProfileEvent | undefined> {
    let $me:Profile;
    me.subscribe(m => $me = m)();
    const args = <QueryEventsArgs>{
      safeAddress: $me.circlesAddress,
      types: [EventType.ChatMessage],
      pagination: {
        order: SortOrder.Desc,
        limit: 1,
        continueAt: new Date().toJSON()
      },
      filter: {
        with: this.filter.with,
        chatMessage: {
          id: parseInt(primaryKey)
        }
      },
    };

    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const queryResult: any = await apiClient.query({
      query: this.query,
      variables: args,
    });

    if (queryResult?.data?.events?.length > 0) {
      const message = queryResult.data.events[0];
      this.addToCache(message);
      return message;
    }
    return undefined;
  }

  protected maintainExternalCaches(event: ProfileEvent): void {
    if (event.payload.__typename == EventType.Purchased) {
      myPurchases.addToCache(event);
    } else if (event.payload.__typename == EventType.CrcHubTransfer) {
      myTransactions.addToCache(event);
    }
  }
}

export class MyChats {
  readonly myChats:{[withCirclesAddress:string]:MyChat} = {};

  with (circlesAddress:string) : MyChat {
    if (!this.myChats[circlesAddress]) {
      this.myChats[circlesAddress] = new MyChat(circlesAddress, SortOrder.Desc, 20);
    }
    return this.myChats[circlesAddress];
  }
}

export const myChats = new MyChats();