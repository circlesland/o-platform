import {EventPayload, EventType, NewUser, ProfileEvent, SortOrder,} from "../api/data/types";
import {PagedEventQuery, PagedEventQueryIndexEntry} from "./pagedEventQuery";

export class NewUsers extends PagedEventQuery {
  constructor(sortOrder:SortOrder, pageSize = 20) {
    super([EventType.NewUser], sortOrder, pageSize);
  }

  getPrimaryKey(eventPayload: EventPayload): string {
    return (<NewUser>eventPayload).profile.id.toString();
  }

  protected getIndexedValues(event: ProfileEvent): PagedEventQueryIndexEntry[] {
    const newUserProfile = <NewUser>event.payload;
    return [{
      indexName: "circlesAddress",
      indexKey: newUserProfile.profile.circlesAddress
    }];
  }

  findSingleItemFallback(types: string[], primaryKey: string): Promise<ProfileEvent | undefined> {
    return undefined;
  }
}

export const newUsers = new NewUsers(SortOrder.Desc);
