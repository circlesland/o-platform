import { readable } from "svelte/store";
import { Stats, StatsDocument, StatsQueryVariables } from "../api/data/types";

import { ApiClient } from "../apiConnection";

export const stats = readable<Stats | null>(null, function start(set) {
  ApiClient.query<Stats, StatsQueryVariables>(StatsDocument, {}).then((stats) => set(stats));

  return function stop() {};
});
