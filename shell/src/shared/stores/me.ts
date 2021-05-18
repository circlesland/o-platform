
import {readable} from "svelte/store";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type Profile = {
  id: number
  circlesAddress?: string
  circlesSafeOwner?: string
  firstName: string
  lastName?: string
  dream: string
  country?: string
  avatarUrl?: string
  avatarCid?: string
  avatarMimeType?: string
  newsletter?:boolean
}

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
  }

  return function stop() {
    subscription.unsubscribe();
  };
});
