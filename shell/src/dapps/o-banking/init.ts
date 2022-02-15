import { me } from "../../shared/stores/me";
import { Subscription } from "rxjs";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Banking } from "./banking";
import { Profile } from "../../shared/api/data/types";

let profile: Profile | undefined;
let shellEventSubscription: Subscription | undefined;
let unsubscribeMe: () => void;
let bankingInstance: Banking;

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
      bankingInstance = new Banking();
    } else {
      return;
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
        return;
      }
    }
  );

  return function stop() {
    shellEventSubscription.unsubscribe();
    unsubscribeMe();
  };
}
