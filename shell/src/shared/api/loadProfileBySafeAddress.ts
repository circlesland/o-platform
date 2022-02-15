import {
    Profile,
    ProfileBySafeAddressDocument,
    ProfileBySafeAddressQueryVariables
} from "./data/types";
import {ApiClient} from "../apiConnection";

export async function loadProfileBySafeAddress(safeAddress: string) : Promise<Profile> {
    const result = await ApiClient.query<Profile[], ProfileBySafeAddressQueryVariables>(ProfileBySafeAddressDocument,{
        safeAddress: safeAddress.toLowerCase()
    });

    const profile =
        result.length == 1
            ? result[0]
            : undefined;

    if (profile) {
        return profile;
    }

    return {
        id: 0,
        circlesAddress: safeAddress,
        firstName: "",
    };
}