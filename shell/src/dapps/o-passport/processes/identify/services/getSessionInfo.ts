import {SessionInfo, SessionInfoDocument, SessionInfoQueryVariables} from "../../../../../shared/api/data/types";
import {ApiClient} from "../../../../../shared/apiConnection";
import {Subscription} from "rxjs";

let sessionInfo: SessionInfo|undefined = undefined;
let shellEventSubscription: Subscription|undefined = undefined;

export const getSessionInfo = async () => {
  if (!sessionInfo) {
    if (!shellEventSubscription) {
      shellEventSubscription = window.o.events.subscribe(e => {
        if (e.type == "shell.authenticated") {
          sessionInfo = null;
        }
      });
    }
    sessionInfo = await ApiClient.query<SessionInfo, SessionInfoQueryVariables>(SessionInfoDocument, {});
  }
  return sessionInfo;
};