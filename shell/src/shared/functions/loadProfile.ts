import { loadProfileByProfileId } from "../api/loadProfileByProfileId";
import { loadProfileBySafeAddress } from "../api/loadProfileBySafeAddress";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import {CommonTrust, CommonTrustDocument, CommonTrustQueryVariables, Profile} from "../api/data/types";
import {ApiClient} from "../apiConnection";
import {me} from "../stores/me";

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
  let commonTrusts: CommonTrust[] = [];
  if ($me.circlesAddress !== apiProfile.circlesAddress) {
    const mutualFriends = await ApiClient.query<CommonTrust[], CommonTrustQueryVariables>(CommonTrustDocument, {
      safeAddress1: $me.circlesAddress.toLowerCase(),
      safeAddress2: apiProfile.circlesAddress.toLowerCase(),
    });
    commonTrusts = mutualFriends.filter((o) => o.profile);
  }

  return {
    profile: {
      id: apiProfile.id,
      avatarUrl: apiProfile.avatarUrl,
      dream: apiProfile.dream,
      emailAddress: apiProfile.emailAddress,
      askedForEmailAddress: apiProfile.askedForEmailAddress,
      country: apiProfile.country,
      safeAddress: apiProfile.circlesAddress,
      firstName: apiProfile.firstName,
      lastName: apiProfile.lastName,
      circlesAddress: apiProfile.circlesAddress,
      circlesSafeOwner: apiProfile.circlesSafeOwner,
      displayName: apiProfile.displayName,
      trusting: undefined,
      trustedBy: undefined,
      cityGeonameid: apiProfile.cityGeonameid,
      city: apiProfile.city
    },
    commonTrusts: commonTrusts,
  };
}
