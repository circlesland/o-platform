import {EventPayload, EventType, InvitationRedeemed, NewUser, ProfileEvent, SortOrder,} from "../api/data/types";
import {PagedEventQuery, PagedEventQueryIndexEntry} from "./pagedEventQuery";

export class RedeemedInvitations extends PagedEventQuery {
  constructor(sortOrder:SortOrder, pageSize = 20) {
    super([EventType.InvitationRedeemed], sortOrder, pageSize);
  }

  getPrimaryKey(eventPayload: EventPayload): string {
    return (<InvitationRedeemed>eventPayload).redeemedBy;
  }

  protected getIndexedValues(event: ProfileEvent): PagedEventQueryIndexEntry[] {
    return [];
  }

  findSingleItemFallback(types: string[], primaryKey: string): Promise<ProfileEvent | undefined> {
    return undefined;
  }

  protected maintainExternalCaches(event: ProfileEvent): void {
  }
}

export const redeemedInvitations = new RedeemedInvitations(SortOrder.Desc);
