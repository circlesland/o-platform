import {postToFacetecApi} from "./call";

export type Enrollment3dParams = {
  faceScan: any,
  auditTrailImage: any,
  lowQualityAuditTrailImage: any,
  sessionId: string,
  externalDatabaseRefID: string,
  groupName: string
};

export async function callEnrollment3d(
  sessionId: string,
  parameters: Enrollment3dParams) {
  return postToFacetecApi(sessionId, `/enrollment-3d`, parameters);
}