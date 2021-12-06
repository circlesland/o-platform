import {SessionInfo, SessionInfoDocument, SessionInfoQueryVariables} from "../../../../../shared/api/data/types";
import {ApiClient} from "../../../../../shared/apiConnection";

export const getSessionInfo = async () => {
  const sessionInfo = await ApiClient.query<SessionInfo, SessionInfoQueryVariables>(SessionInfoDocument, {});
  return sessionInfo;
};