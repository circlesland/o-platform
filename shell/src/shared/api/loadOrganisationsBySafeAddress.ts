import {Organisation, OrganisationsByAddressDocument} from "./data/types";

export async function loadOrganisationsBySafeAddress(addresses: string[]) : Promise<Organisation[]> {
  // 1. Try to find a profile via the api
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query: OrganisationsByAddressDocument,
    variables: {
      addresses: addresses.map(o => o.toLowerCase()),
    },
  });
  if (result.errors) {
    throw new Error(
      `Couldn't load a one or more of the requested profiles: ${JSON.stringify(
        result.errors
      )}`
    );
  }

  return result.data.organisationsByAddress;
}