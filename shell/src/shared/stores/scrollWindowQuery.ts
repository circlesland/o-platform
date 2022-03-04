import {
  EventPayload,
  EventType,
  PaginationArgs,
  Profile,
  ProfileEvent, QueryEventsArgs,
  SortOrder,
  StreamDocument
} from "../api/data/types";
import {writable} from "svelte/store";
import {me} from "./me";
import {Subscriber} from "rxjs";
import {EventCache} from "./eventCache";

export class ScrollWindowQuery<T extends EventPayload> {
  readonly eventType:EventType;
  readonly order: SortOrder = SortOrder.Desc;
  readonly limit: number = 15;
  readonly pageDelimiterProperty: string = "timestamp";
  readonly query = StreamDocument;
  readonly getIdentity: (element:T) => string;

  private readonly _subscribe:any;
  private readonly _set:any;

  private _pagination?: PaginationArgs;
  private _resultCache: {[identity:string]:ProfileEvent} = {};

  private _profileChangedSubscription:any;

  constructor(eventType: EventType, order: SortOrder, limit: number, pageDelimiterProperty: string, getIdentity: (element:T) => string) {
    this.eventType = eventType;
    this.order = order;
    this.limit = limit;
    this.pageDelimiterProperty = pageDelimiterProperty;
    this.getIdentity = getIdentity;


    const { subscribe, set } = writable<ProfileEvent[]>(
      [], (set) => {
        this._profileChangedSubscription = me.subscribe(async $me => {
          this.reset();
          const result = await this.next();
          set(result);
        });
        this.next().then(result => {
          set(result);
        });

        return () => {
          this._profileChangedSubscription();
        }
      }
    );
    this._subscribe = subscribe;
    this._set = set;

    this.reset();
  }

  private reset() {
    this._pagination = {
      order: this.order,
      limit: this.limit,
      continueAt: this.order == SortOrder.Desc
        ? new Date().toJSON()
        : new Date(0).toJSON()
    };
  }

  private async next() : Promise<ProfileEvent[]> {
    let $me:Profile;
    me.subscribe(m => $me = m)();
    const args = <QueryEventsArgs>{
      safeAddress: $me.circlesAddress,
      types: [this.eventType],
      pagination: this._pagination,
      filter: undefined,
    };

    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const timeline: any = await apiClient.query({
      query: this.query,
      variables: args,
    });

    if (timeline.errors) {
      throw new Error(window.i18n("shared.stores.transactions.errors.couldNotLoadData", { values: { error: JSON.stringify(timeline.errors)}}));
    }

    let newBatch:ProfileEvent[] = timeline.data.events;
    if (newBatch.length > 0) {
      newBatch.forEach((e) => {
        const identity = this.getIdentity(<T>e.payload);
        this._resultCache[identity] = e;
        EventCache.addOrUpdate(this.eventType, identity, e)
      });

      this._pagination = {
        order: this.order,
        continueAt: newBatch[newBatch.length - 1][this.pageDelimiterProperty],
        limit: this.limit,
      };
    }

    const allValues = Object.values(this._resultCache).sort((a, b) => {
      const _a = new Date(a.timestamp).getTime();
      const _b = new Date(b.timestamp).getTime();
      return _a > _b
        ? -1
        : _a < _b
          ? 1
          : 0;
    });

    this._set(allValues);

    return allValues;
  }

  subscribe(run: Subscriber<any>) {
    return this._subscribe(run);
  }

  async fetchMore() {
    const result = await this.next();
    return result.length >= this.limit;
  }
}