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
        throw new Error(window.o.i18n("shared.api.loadProfileByProfileId.error", { values: { profileId: profileId }}));
    }

    return {
        ...apiProfile,
        circlesAddress: apiProfile.circlesAddress ? apiProfile.circlesAddress : null
    };
}