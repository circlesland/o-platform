import {MyProfileDocument} from "../../../data/api/types";

export const loadProfile = async () => {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query: MyProfileDocument
  });

  return result.data.profiles && result.data.profiles.length > 0
    ? result.data.profiles[0]
    : undefined;
}