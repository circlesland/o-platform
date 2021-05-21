import {ProfilesByCirclesAddressDocument} from "./api/types";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {Safe} from "./circles/types";

async function loadProfilesBySafeAddress(circlesAddresses: string[]) {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query: ProfilesByCirclesAddressDocument,
    variables: {
      circlesAddresses: circlesAddresses
    }
  });

  console.log("All profiles in transactions list:", result.data.profiles)
  return result.data.profiles.map(p => {
    return {
      ...p,
      circlesAddress : RpcGateway.get().utils.toChecksumAddress(p.circlesAddress)
    }
  });
}

async function loadCirclesGardenProfilesBySafeAddress(circlesAddresses: string[]) {
  const baseUrl = `https://api.circles.garden/api/users/`;
  if (circlesAddresses.length == 0) {
    return [];
  }
  let query = circlesAddresses.reduce((p, c) => p + `address[]=${RpcGateway.get().utils.toChecksumAddress(c)}&`, "");
  query = query.substr(0, query.length - 1);
  console.log("Querying the following profiles from the circles garden api:", query);

  const result = await fetch(`${baseUrl}?${query}`);
  const resultJson = await result.json();
  console.log(resultJson);

  return resultJson.data;
}

async function createProfileMap(safeAddresses:string[]) {
  const profiles = await Promise.all([
    loadProfilesBySafeAddress(safeAddresses),
    loadCirclesGardenProfilesBySafeAddress(safeAddresses)
  ]);
  const map:{
    [safeAddress:string]:{
      safeAddress: string
      displayName: string
      avatarUrl: string
    }
  } = {};
  const garden = profiles[1];
  garden.forEach(profile => {
    map[profile.safeAddress] = {
      safeAddress: profile.safeAddress,
      displayName: `${profile.username}`,
      avatarUrl: profile.avatarUrl
    };
  });
  const land = profiles[0];
  land.forEach(profile => {
    map[profile.circlesAddress] = {
      safeAddress: RpcGateway.get().utils.toChecksumAddress(profile.circlesAddress),
      displayName: `${profile.firstName} ${profile.lastName ?? ""}`,
      avatarUrl: profile.avatarUrl
    };
  });
  return map;
}

function findAllSafeAddresses(safe:Safe) {
  const addresses: {[safeAddress:string]: null} = {};

  // First: Add the own address
  if (safe.safeAddress) {
    addresses[safe.safeAddress] = null;
  }

  // Then add all transfer participants
  if (safe.transfers?.rows) {
    safe.transfers.rows.forEach(transfer => {
      addresses[transfer.from] = null;
      addresses[transfer.to] = null;
    });
  }

  const trusts = Object.values(safe.trustRelations?.trusting ?? {}).concat(Object.values(safe.trustRelations?.trustedBy ?? {}));
  trusts.forEach(trust => {
    addresses[trust.safeAddress] = null;
  });

  return Object.keys(addresses);
}

function tryGetSimplifiedProfile(profileMap:{[safeAddress:string]:any}, safeAddress:string) : {
  safeAddress: string
  displayName: string
  avatarUrl: string
} {
  return profileMap[safeAddress];
}

export async function augmentSafeWithProfiles(safe:Safe) {
  const allAddresses = findAllSafeAddresses(safe);
  const profiles = await createProfileMap(allAddresses);

  // First: Add the own address
  if (safe.safeAddress && safe.token) {
    safe.token.ownerProfile = tryGetSimplifiedProfile(profiles, RpcGateway.get().utils.toChecksumAddress(safe.safeAddress))
  }

  // Then add all transfer participants
  if (safe.transfers?.rows) {
    safe.transfers.rows.forEach(transfer => {
      transfer.fromProfile = tryGetSimplifiedProfile(profiles, transfer.from);
      transfer.toProfile = tryGetSimplifiedProfile(profiles, transfer.to);
    });
  }

  const trusts = Object.values(safe.trustRelations?.trusting ?? {})
    .concat(Object.values(safe.trustRelations?.trustedBy ?? {}))
    .concat(Object.values(safe.trustRelations?.untrusted ?? {}));
  trusts.forEach(trust => {
    trust.profile = tryGetSimplifiedProfile(profiles, trust.safeAddress);
  });

  if (safe.acceptedTokens && safe.acceptedTokens.tokens) {
    for (let tokensKey in safe.acceptedTokens.tokens) {
      safe.acceptedTokens.tokens[tokensKey].ownerProfile = tryGetSimplifiedProfile(profiles, safe.acceptedTokens.tokens[tokensKey].tokenOwner);
    }
  }
}