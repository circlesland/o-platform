import {readable} from "svelte/store";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";

export type Profile = {
  firstName: string
  lastName?: string
  dream: string
  country?: string
  avatarCid?: string
  avatarMimeType?: string
}

export const me = readable<Profile|null>(null, function start(set) {
  const subscription = window.o.events.subscribe((event: PlatformEvent & {
    profile: Profile
  }) => {
    if (event.type != "shell.authenticated" || !event.profile) {
      return;
    }
    set(event.profile);
    localStorage.setItem("me", JSON.stringify(event.profile));
  });

  const cachedProfile = localStorage.getItem("me");
  if (cachedProfile) {
    try {
      const profile = JSON.parse(cachedProfile);
      set(profile);
    } catch (e) {
      localStorage.removeItem("me");
    }
  }

  return function stop() {
    subscription.unsubscribe();
  };
});
