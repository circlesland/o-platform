import {readable} from "svelte/store";
import {Stats, StatsDocument, StatsQueryVariables} from "../api/data/types";
import {Subscriber} from "svelte/types/runtime/store";
import {ApiClient} from "../apiConnection";

export const stats = {
  subscribe: (subscriber: Subscriber<Stats|null>) => _stats.subscribe(subscriber)
};
const _stats = readable<Stats|null>(null, function start(set) {
  ApiClient.query<Stats, StatsQueryVariables>(StatsDocument, {})
    .then(stats => set(stats));

  return function stop() {
  };
});
