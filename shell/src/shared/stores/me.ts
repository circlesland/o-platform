import {readable} from "svelte/store";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
import {shellProcess, ShellProcessContext} from "../processes/shellProcess";
import {identify, IdentifyContextData} from "../../dapps/o-passport/processes/identify/identify";
import {location} from "svelte-spa-router";

export type Profile = {
  id: number
  circlesAddress?: string
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
      console.log("me.ts new $me: ", event.profile);
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

    const requestEvent = new RunProcess<ShellProcessContext>(
        shellProcess,
        true,
        async (ctx) => {
          ctx.childProcessDefinition = identify;
          ctx.childContext = {
            data: <IdentifyContextData>{
              redirectTo: window.document.location.href,
            },
          };
          return ctx;
        }
    );
    window.o.publishEvent(requestEvent);
  }

  return function stop() {
    subscription.unsubscribe();
  };
});
