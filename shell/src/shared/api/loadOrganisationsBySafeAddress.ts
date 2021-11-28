import {
  Organisation,
  OrganisationsByAddressDocument,
  OrganisationsByAddressQueryVariables
} from "./data/types";
import {ApiClient} from "../apiConnection";

export async function loadOrganisationsBySafeAddress(addresses: string[]) : Promise<Organisation[]> {
  // 1. Try to find a profile via the api
  const organisations = await ApiClient.query<Organisation[], OrganisationsByAddressQueryVariables>(
    OrganisationsByAddressDocument, {
      addresses: addresses.map(o => o.toLowerCase())
    });

  return organisations;
}