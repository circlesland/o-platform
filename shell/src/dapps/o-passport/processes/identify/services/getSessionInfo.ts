import {SessionInfo, SessionInfoDocument, SessionInfoQueryVariables} from "../../../../../shared/api/data/types";
import {ApiClient} from "../../../../../shared/apiConnection";
import {Subscription} from "rxjs";

let sessionInfo: SessionInfo|undefined = undefined;
let shellEventSubscription: Subscription|undefined = undefined;

export const getSessionInfo = async () => {
  if (!shellEventSubscription) {
    shellEventSubscription = window.o.events.subscribe(e => {
      if (e.type == "shell.authenticated") {
        sessionInfo = null;
      }
    });
  }
  if (!sessionInfo?.isLoggedOn) {
    sessionInfo = await ApiClient.query<SessionInfo, SessionInfoQueryVariables>(SessionInfoDocument, {});
  }
  return sessionInfo;
};