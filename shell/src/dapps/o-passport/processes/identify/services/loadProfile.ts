import {MyProfileDocument, ProfilesDocument} from "../../../data/api/types";

export const loadProfile = async (profileId?:number) => {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  if (profileId) {
    const profiles = await apiClient.query({
      query: ProfilesDocument,
      variables: {
        id: profileId
      }
    });

    return profiles.data.profiles && profiles.data.profiles.length > 0
      ? profiles.data.profiles[0]
      : undefined;
  } else {
    const result = await apiClient.query({
      query: MyProfileDocument
    });

    return result.data.profiles && result.data.profiles.length > 0
      ? result.data.profiles[0]
      : undefined;
  }
}