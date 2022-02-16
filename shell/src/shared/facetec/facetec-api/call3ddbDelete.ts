import {postToFacetecApi} from "./call";

export async function call3ddbDelete(
  sessionId: string,
  databaseRefId: string,
  groupName: string
  ) {
  return postToFacetecApi(sessionId, `/3d-db/delete`, {
    externalDatabaseRefID: databaseRefId,
    groupName: groupName
  });
}