import {MyProfileDocument, Profile, ProfilesDocument} from "../../../../../shared/api/data/types";

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

    profile = profiles.data.profilesById && profiles.data.profilesById.length > 0
      ? profiles.data.profilesById[0]
      : undefined;
  } else {
    const result = await apiClient.query({
      query: MyProfileDocument
    });

    profile = result.data.myProfile;
  }

  return profile ? {
    ...profile,
  } : undefined;
}