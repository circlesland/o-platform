import {postToFacetecApi} from "./call";

export async function call3ddbSearch(
  sessionId: string,
  databaseRefId: string,
  groupName: string
) {
  return postToFacetecApi(sessionId, `/3d-db/search`, {
    externalDatabaseRefID: databaseRefId,
    groupName: groupName,
    minMatchLevel: 10
  });
}