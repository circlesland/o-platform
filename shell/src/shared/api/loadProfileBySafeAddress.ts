import {Profile, ProfileBySafeAddressDocument} from "./data/types";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

export async function loadProfileBySafeAddress(safeAddress: string) : Promise<Profile> {
    // 1. Try to find a profile via the api
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
        query: ProfileBySafeAddressDocument,
        variables: {
            safeAddress: safeAddress.toLowerCase(),
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
        result.data.profilesBySafeAddress.length == 1
            ? result.data.profilesBySafeAddress[0]
            : undefined;

    if (profile) {
        return profile;
    }

    return {
        id: 0,
        circlesAddress: RpcGateway.get().utils.toChecksumAddress(safeAddress),
        firstName: "",
    };
}