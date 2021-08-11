import {readable} from "svelte/store";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {runShellProcess} from "../processes/shellProcess";
import {identify, IdentifyContextData} from "../../dapps/o-passport/processes/identify/identify";
import {Profile} from "../../dapps/o-passport/data/api/types";

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

    window.o.publishEvent(runShellProcess(identify, <IdentifyContextData>{
      redirectTo: window.document.location.href,
    }));
  }

  return function stop() {
    subscription.unsubscribe();
  };
});
