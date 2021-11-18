import { me } from "../../shared/stores/me";
import { Subscription } from "rxjs";
// import { Safe } from "./data/circles/types";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
// import { emptySafe } from "./data/emptySafe";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { DelayedTrigger } from "@o-platform/o-utils/dist/delayedTrigger";
import { Banking } from "./banking";
import {Profile} from "../../shared/api/data/types";

// let _currentSafe: Safe | null = emptySafe;
let profile: Profile | undefined;
let shellEventSubscription: Subscription | undefined;
let unsubscribeMe: () => void;
let bankingInstance: Banking;

const mountTrigger = new DelayedTrigger(100, async () => {
  if (!bankingInstance) return;
  await bankingInstance.onMount();
  //await bankingInstance.tryGetUbi();
  /*await Banking.transferAllAccountXdaiToSafe(
    "",
    sessionStorage.getItem("circlesKey")
  );*/
});

export async function init() {
  if (shellEventSubscription) {
    shellEventSubscription.unsubscribe();
  }
  if (unsubscribeMe) {
    unsubscribeMe();
  }

  // console.log(`banking:1 subscribes to $me ..`);
  unsubscribeMe = me.subscribe(async (profileOrNull) => {
    // console.log(`banking:1 $me changed:`, profileOrNull);
    profile = profileOrNull;
    if (
      !bankingInstance &&
      RpcGateway.get().utils.isAddress(profileOrNull?.circlesAddress)
    ) {
      bankingInstance = new Banking(profile.circlesAddress);
    } else {
      return;
    }
    if (profileOrNull) {
      mountTrigger.trigger();
    }
  });
  // console.log(`banking:1 subscribed to $me`);

  shellEventSubscription = window.o.events.subscribe(
    async (
      event: PlatformEvent & {
        profile: Profile;
      }
    ) => {
      if (event.type == "shell.loggedOut") {
        localStorage.removeItem("safe");
        localStorage.removeItem("circlesAddress");
        localStorage.removeItem("circlesKey");
        localStorage.removeItem("lastUBI");
        profile = null;
        window.o.publishEvent(<any>{
          type: "shell.refresh",
          dapp: "banking:1",
          data: null,
        });
        return;
      }
    }
  );

  return function stop() {
    shellEventSubscription.unsubscribe();
    unsubscribeMe();
  };
}