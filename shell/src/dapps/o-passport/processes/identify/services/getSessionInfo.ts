import {SessionInfoDocument} from "../../../data/api/types";

export const getSessionInfo = async () => {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query: SessionInfoDocument
  });

  if (result.errors && result.errors.length > 0) {
    result.errors.forEach(o => console.error(o));
    throw new Error(`Couldn't query the session info.`);
  }

  return {
    isLoggedOn: result.data.sessionInfo.isLoggedOn,
    hasProfile: result.data.sessionInfo.hasProfile,
    profileId: result.data.sessionInfo.profileId
  };
};