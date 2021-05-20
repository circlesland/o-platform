import {readable} from "svelte/store";
import {Safe} from "../data/circles/types";
import {emptySafe} from "../data/emptySafe";
import {tryGetCurrentSafe} from "../init";

let currentSafe:Safe|null = null;

export const mySafe = readable<Safe|null>(null, (set) => {
  set(tryGetCurrentSafe() ?? emptySafe);

  const sub = window.o.events.subscribe(event => {
    if ((<any>event).dapp !== "banking:1") {
      return;
    }
    if (event.type === "shell.refresh") {
      currentSafe = (<any>event).data;
      set(currentSafe);
    }
    if (event.type === "shell.progress" &&  currentSafe) {
      currentSafe.ui = {
        loadingPercent: (<any>event).percent,
        loadingText: (<any>event).message
      };
      set(currentSafe);
    }
  })

  return function stop() {
    if (sub) {
      sub.unsubscribe();
    }
  };
});
