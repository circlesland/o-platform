import {SessionInfoDocument} from "../../../../../shared/api/data/types";

export const getSessionInfo = async () => {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query: SessionInfoDocument
  });

  if (result.errors && result.errors.length > 0) {
    result.errors.forEach(o => console.error(o));
    throw new Error(`Couldn't query the session info.`);
  }

  return result.data.sessionInfo;
};