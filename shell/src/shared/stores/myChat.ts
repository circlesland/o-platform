import {EventPayload, EventType, ProfileEvent, ProfileEventFilter, SortOrder,} from "../api/data/types";
import {PagedEventQuery, PagedEventQueryIndexEntry} from "./pagedEventQuery";

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

  findSingleItemFallback(types: string[], primaryKey: string): Promise<ProfileEvent | undefined> {
    return undefined;
  }
}

export class MyChats {
  readonly myChats:{[withCirclesAddress:string]:MyChat} = {};

  with (circlesAddress:string) {
    if (!this.myChats[circlesAddress]) {
      this.myChats[circlesAddress] = new MyChat(circlesAddress, SortOrder.Desc, 20);
    }
    return this.myChats[circlesAddress];
  }
}

export const myChats = new MyChats();