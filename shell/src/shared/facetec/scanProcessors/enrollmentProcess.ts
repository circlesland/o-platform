import { FaceTecSDK } from "../facetec-sdk/core-sdk/FaceTecSDK.js/FaceTecSDK";
import type { FaceTecSessionResult, FaceTecFaceScanResultCallback, FaceTecFaceScanProcessor } from "../facetec-sdk/core-sdk/FaceTecSDK.js/FaceTecPublicApi";
import {callEnrollment3d} from "../facetec-api/callEnrollment3d";

export class EnrollmentProcess implements FaceTecFaceScanProcessor {

  private _onSuccess: (result: FaceTecSessionResult) => void = () => {};
  private _onError: (e:any) => void = () => {};

  private _sessionResult: FaceTecSessionResult|undefined = undefined;

  private _groupName:string;
  private _3dDbRef:string;

  result:Promise<FaceTecSessionResult>;

  constructor(sessionToken: string, groupName:string, _3dDbRef:string) {
    new FaceTecSDK.FaceTecSession(
      this,
      sessionToken
    );
    this._groupName = groupName;
    this._3dDbRef = _3dDbRef;

    this.result = new Promise<FaceTecSessionResult>((resolve, reject) => {
      this._onSuccess = resolve;
      this._onError = reject;
    });
  }

  //
  // Handling the Result of a FaceScan
  //
  public async processSessionResultWhileFaceTecSDKWaits(
    sessionResult: FaceTecSessionResult,
    faceScanResultCallback: FaceTecFaceScanResultCallback) {

    this._sessionResult = sessionResult;
    try {
      if (sessionResult.status !== FaceTecSDK.FaceTecSessionStatus.SessionCompletedSuccessfully) {
        faceScanResultCallback.cancel();
        this._onError(new Error("Session was not completed successfully, cancelling.  Session Status: " + FaceTecSDK.FaceTecSessionStatus[sessionResult.status]));
        return;
      }

      if (!sessionResult.sessionId) {
        this._onError(new Error("No sessionId"));
        return;
      }

      const resultJson = await callEnrollment3d(sessionResult.sessionId, {
        faceScan: sessionResult.faceScan,
        auditTrailImage: sessionResult.auditTrail[0],
        lowQualityAuditTrailImage: sessionResult.lowQualityAuditTrail[0],
        sessionId: sessionResult.sessionId,
        externalDatabaseRefID: this._3dDbRef,
        groupName: this._groupName
      });

      if (resultJson.wasProcessed) {
        faceScanResultCallback.proceedToNextStep(resultJson.scanResultBlob);
      } else {
        faceScanResultCallback.cancel();
        this._onError(new Error("Unexpected API response, cancelling out."));
      }
    } catch (e) {
      this._onError(e);
    }
  }

  public onFaceTecSDKCompletelyDone = () => {
    if (!this._sessionResult) {
      this._onError(new Error("No _sessionResult."));
      return;
    }

    this._onSuccess(this._sessionResult);
  }
}