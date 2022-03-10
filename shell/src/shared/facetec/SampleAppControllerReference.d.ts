import { FaceTecIDScanResult, FaceTecSessionResult } from "../../../core-sdk/FaceTecSDK.js/FaceTecPublicApi";

// Define types for the Sample App functions that are shared with the processors.
// This allows for TS typing and VSCode autocompletion

//Function called when the processors are result
export interface OnComplete {
  (sessionResult: FaceTecSessionResult| null, idScanResult: FaceTecIDScanResult | null, latestNetworkResponseStatus: number):void
}

// Function to return the enrollment identifier
export interface GetLatestEnrollmentIdentifier {
  (): string;
}

// Function to clear the enrollment identifier
export interface ClearLatestEnrollmentIdentifier{
  (): void;
}

// All sample app functions that are shared with the processors
export interface SampleAppControllerReference {
  onComplete: OnComplete,
  getLatestEnrollmentIdentifier: GetLatestEnrollmentIdentifier,
  clearLatestEnrollmentIdentifier: ClearLatestEnrollmentIdentifier
}
