import {readable} from "svelte/store";
import {Safe} from "../data/circles/queries";
import {emptySafe, tryGetCurrentSafe} from "../../o-banking.manifest";

export const mySafe = readable<Safe|null>(null, (set) => {
  set(tryGetCurrentSafe() ?? emptySafe);

  const sub = window.o.events.subscribe(event => {
    if (event.type !== "shell.refresh") {
      return;
    }
    if ((<any>event).dapp !== "banking:1") {
      return;
    }
    set((<any>event).data);
  })

  return function stop() {
    if (sub) {
      sub.unsubscribe();
    }
  };
});
