import {
  MyProfileDocument, MyProfileQueryVariables,
  Profile,
  ProfilesDocument,
  ProfilesQueryVariables
} from "../../../../../shared/api/data/types";
import {ApiClient} from "../../../../../shared/apiConnection";

export const loadProfile = async (profileId?:number) => {
  if (profileId) {
    const profiles = await ApiClient.query<Profile[], ProfilesQueryVariables>(ProfilesDocument, {
      id: [profileId]
    });
    return profiles && profiles.length > 0
      ? profiles[0]
      : undefined;
  } else {
    const myProfile = await ApiClient.query<Profile, MyProfileQueryVariables>(MyProfileDocument, {});
    return myProfile;
  }
}