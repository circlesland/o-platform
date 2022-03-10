import {postToFacetecApi} from "./call";

export async function call3ddbEnroll(
  sessionId: string,
  databaseRefId: string,
  groupName: string
  ) {
  return postToFacetecApi(sessionId, `/3d-db/enroll`, {
    externalDatabaseRefID: databaseRefId,
    groupName: groupName
  });
}