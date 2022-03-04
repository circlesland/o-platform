import {EventType} from "../api/data/types";

export class EventCache {
  private static _cache:{[typeAndIdentity:string]:any} = {};
  public static addOrUpdate(type:EventType, identity:string, element:any) {
    this._cache[type + "_" + identity] = element;
  }
  public static tryGet(type:EventType, identity:string) : any {
    return this._cache[type + "_" + identity];
  }
}