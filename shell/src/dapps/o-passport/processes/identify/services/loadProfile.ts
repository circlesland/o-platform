import {MyProfileDocument, Profile, ProfilesDocument} from "../../../data/api/types";

export const loadProfile = async (profileId?:number) => {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  let profile:Profile|undefined;
  if (profileId) {
    const profiles = await apiClient.query({
      query: ProfilesDocument,
      variables: {
        id: [profileId]
      }
    });

    profile = profiles.data.profiles && profiles.data.profiles.length > 0
      ? profiles.data.profiles[0]
      : undefined;
  } else {
    const result = await apiClient.query({
      query: MyProfileDocument
    });

    profile = result.data.profiles && result.data.profiles.length > 0
      ? result.data.profiles[0]
      : undefined;
  }

  return profile ? {
    ...profile,
  } : undefined;
}