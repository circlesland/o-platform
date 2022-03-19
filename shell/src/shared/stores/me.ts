import {readable} from "svelte/store";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Profile, SessionInfo} from "../api/data/types";
import {displayableName} from "../functions/stringHelper";
import {Subscriber} from "svelte/types/runtime/store";
import {getSessionInfo} from "../../dapps/o-passport/processes/identify/services/getSessionInfo";

let sessionInfo: SessionInfo | undefined = undefined;

export const me = {
  subscribe: (subscriber: Subscriber<Profile|null>) => _me.subscribe(subscriber),
  getSessionInfo: async (reload:boolean = false) => {
    if (!sessionInfo || reload) {
      sessionInfo = await getSessionInfo();
    }
    return sessionInfo;
  }
};
const _me = readable<Profile|null>(null, function start(set) {
  const subscription = window.o.events.subscribe((event: PlatformEvent & {
    profile: Profile
    sessionInfo: SessionInfo|undefined
  }) => {
    if (event.type == "shell.loggedOut") {
      const notMe = <Profile>{
        "id": 0,
        "circlesAddress": "",
        "displayCurrency": "EURS",
        "circlesSafeOwner": "",
        "successorOfCirclesAddress": null,
        "displayName": "",
        "firstName": "",
        "lastName": "",
        "emailAddress": "",
        "askedForEmailAddress": true,
        "dream": null,
        "country": null,
        "avatarUrl": "",
        "avatarCid": null,
        "avatarMimeType": "image/jpeg",
        "newsletter": true,
        "displayTimeCircles": true,
        "cityGeonameid": null,
        "city": null,
        "memberships": [],
        "verifications": [],
        "circlesTokenAddress": "",
        "__typename": "Profile"
      };
      localStorage.setItem("me", JSON.stringify(notMe));
      set(notMe);
      return;
    }
    if (event.type == "shell.authenticated" && event.profile) {
      sessionInfo = event.sessionInfo;
      if (!event.profile.displayName) {
        event.profile.displayName = displayableName(event.profile.firstName, event.profile.lastName);
      }
      set(event.profile);
      console.log("me.ts new $me: ", event.profile);
      localStorage.setItem("me", JSON.stringify(event.profile));
    }
  });

  const cachedProfile = localStorage.getItem("me");
  if (cachedProfile) {
    try {
      const profile = JSON.parse(cachedProfile);
      if (!profile.displayName) {
        profile.displayName = displayableName(profile.firstName, profile.lastName);
      }
      set(profile);
    } catch (e) {
      console.warn(`Parsing of the cached profile from localStorage(me) failed:`, e);
      localStorage.removeItem("me");
      localStorage.removeItem("safe");
    }

    /*
    let $me:Profile;
    me.subscribe(me => {
      $me = me;
    })();
    */
  }

  /*
  setInterval(() => {
    const cachedProfile = localStorage.getItem("me");
    if (!cachedProfile)
      return;

    const p:Profile = JSON.parse(cachedProfile);
    set(p);
  }, 10000);
   */

  return function stop() {
    subscription.unsubscribe();
  };
});
