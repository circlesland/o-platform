import {
    Profile,
    ProfilesDocument, ProfilesQueryVariables
} from "./data/types";
import {ApiClient} from "../apiConnection";

export async function loadProfileByProfileId(profileId: number) : Promise<Profile> {
    const result = await ApiClient.query<Profile[], ProfilesQueryVariables>(ProfilesDocument,{
        id: [profileId]
    });

    const apiProfile: Profile =
        result && result.length
            ? result[0]
            : undefined;

    if (!apiProfile) {
        throw new Error(`Couldn't find a profile with id '${profileId}'.`);
    }

    return {
        ...apiProfile,
        circlesAddress: apiProfile.circlesAddress ? apiProfile.circlesAddress : null
    };
}