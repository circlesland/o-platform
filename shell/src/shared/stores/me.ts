import {readable} from "svelte/store";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Profile} from "../api/data/types";

export const me = readable<Profile|null>(null, function start(set) {
  const subscription = window.o.events.subscribe((event: PlatformEvent & {
    profile: Profile
  }) => {
    if (event.type == "shell.loggedOut") {
      localStorage.removeItem("me");
      set(null);
      return;
    }
    if (event.type == "shell.authenticated" && event.profile) {
      //  console.log("me.ts new $me: ", event.profile);
      set(event.profile);
      localStorage.setItem("me", JSON.stringify(event.profile));
    }
  });

  const cachedProfile = localStorage.getItem("me");
  if (cachedProfile) {
    try {
      const profile = JSON.parse(cachedProfile);
      set(profile);
    } catch (e) {
      console.warn(`Parsing of the cached profile from localStorage(me) failed:`, e);
      localStorage.removeItem("me");
      localStorage.removeItem("safe");
    }

    let $me:Profile;
    const unsub = me.subscribe(me => {
      $me = me;
    });
    unsub();
  }

  return function stop() {
    subscription.unsubscribe();
  };
});
