import {Profile, ProfilesDocument} from "./data/types";
import {RpcGateway} from "../../../../packages/o-circles/dist/rpcGateway";

export async function loadProfileByProfileId(profileId: number) : Promise<Profile> {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
        query: ProfilesDocument,
        variables: {
            id: [profileId],
        },
    });
    if (result.errors) {
        throw new Error(
            `Couldn't load a profile with id '${profileId}': ${JSON.stringify(
                result.errors
            )}`
        );
    }

    const apiProfile: Profile =
        result.data.profiles && result.data.profiles.length
            ? result.data.profiles[0]
            : undefined;

    if (!apiProfile) {
        throw new Error(`Couldn't find a profile with id '${profileId}'.`);
    }

    return {
        ...apiProfile,
        circlesAddress: apiProfile.circlesAddress ? RpcGateway.get().utils.toChecksumAddress(apiProfile.circlesAddress) : null
    };
}