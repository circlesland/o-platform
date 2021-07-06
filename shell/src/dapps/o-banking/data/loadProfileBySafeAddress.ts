import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {Profile, ProfilesByCirclesAddressDocument} from "./api/types";

export async function loadProfileBySafeAddress(safeAddress: string) : Promise<Profile> {
    // 1. Try to find a profile via the api
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
        query: ProfilesByCirclesAddressDocument,
        variables: {
            circlesAddresses: [safeAddress],
        },
    });
    if (result.errors) {
        throw new Error(
            `Couldn't load a profile with safeAddress '${safeAddress}': ${JSON.stringify(
                result.errors
            )}`
        );
    }

    const profile =
        result.data.profiles && result.data.profiles.length
            ? result.data.profiles[0]
            : undefined;

    if (profile) {
        return {
            ...profile,
            circlesAddress: RpcGateway.get().utils.toChecksumAddress(profile.circlesAddress)
        };
    }

    // 2. Try to find a profile via circles garden
    try {
        const requestUrl = `https://api.circles.garden/api/users/?address[]=${safeAddress}`;
        const gardenResult = await fetch(requestUrl);
        if (gardenResult && gardenResult.status == 200) {
            const resultJson = await gardenResult.json();
            const profile =
                resultJson.data && resultJson.data.length
                    ? resultJson.data[0]
                    : undefined;

            if (!profile) {
                return {
                    id: 0,
                    circlesAddress: RpcGateway.get().utils.toChecksumAddress(safeAddress),
                    firstName: ""
                }
            }
            return {
                id: profile.id,
                circlesAddress: RpcGateway.get().utils.toChecksumAddress(safeAddress),
                firstName: profile ? profile.username : "",
                avatarUrl: profile ? profile.avatarUrl : undefined
            };
        }
    } catch (e) {
        console.error(`Couldn't load the following profile metadata from api.circles.garden:`, safeAddress);
    }

    // 3. No profile found
    return {
        id: 0,
        circlesAddress: RpcGateway.get().utils.toChecksumAddress(safeAddress),
        firstName: "",
    };
}