import { loadProfileByProfileId } from "../api/loadProfileByProfileId";
import { loadProfileBySafeAddress } from "../api/loadProfileBySafeAddress";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { CommonTrust, CommonTrustDocument, Profile } from "../api/data/types";

export async function loadProfile(id: string, $me) {
  if (!id) {
    console.warn(
      `No profile specified ('id' must contain safeAddress or profileId)`
    );
    return;
  }

  if (Number.parseInt(id) && !id.startsWith("0x")) {
    const profile = await loadProfileByProfileId(Number.parseInt(id));
    await setProfile(profile, $me);
  } else if (RpcGateway.get().utils.isAddress(id)) {
    const profile = await loadProfileBySafeAddress(id);
    return await setProfile(profile, $me);
  } else {
    throw new Error(`id isn't an integer nor an eth address.`);
  }
}

async function setProfile(apiProfile: Profile, $me) {
  const trust = undefined;
  let commonTrusts: CommonTrust[] = [];
  if ($me.circlesAddress !== apiProfile.circlesAddress) {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: CommonTrustDocument,
      variables: {
        safeAddress1: $me.circlesAddress.toLowerCase(),
        safeAddress2: apiProfile.circlesAddress.toLowerCase(),
      },
    });
    if (result.errors) {
      throw new Error(
        `Couldn't load a profile with safeAddress '${
          apiProfile.circlesAddress
        }': ${JSON.stringify(result.errors)}`
      );
    }
    commonTrusts = result.data.commonTrust.filter((o) => o.profile);
  }

  return {
    profile: {
      id: apiProfile.id,
      avatarUrl: apiProfile.avatarUrl,
      dream: apiProfile.dream,
      country: apiProfile.country,
      safeAddress: apiProfile.circlesAddress,
      firstName: apiProfile.firstName,
      lastName: apiProfile.lastName,
      circlesAddress: apiProfile.circlesAddress,
      circlesSafeOwner: apiProfile.circlesSafeOwner,
      displayName: `${apiProfile.firstName} ${
        apiProfile.lastName ? apiProfile.lastName : ""
      }`,
      trusting: undefined,
      trustedBy: undefined,
      cityGeonameid: apiProfile.cityGeonameid,
      city: apiProfile.city,
      trustsYou: apiProfile.trustsYou ?? 0,
      youTrust: apiProfile.youTrust ?? 0,
    },
    commonTrusts: commonTrusts,
  };
}
