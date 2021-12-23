import {Config} from "../config";
import {FaceTecSDK} from "../facetec-sdk/core-sdk/FaceTecSDK.js/FaceTecSDK";
import {SampleAppUtilities} from "../utilities/SampleAppUtilities";

export async function callSessionToken() {
  const sessionResult = await fetch(Config.BaseURL + "/session-token", {
    headers: {
      "X-Device-Key": Config.DeviceKeyIdentifier,
      "X-User-Agent": FaceTecSDK.createFaceTecAPIUserAgentString("")
    }
  });

  const sessionResultJson = await sessionResult.json();
  const sessionToken: string = sessionResultJson.sessionToken;

  SampleAppUtilities.hideLoadingSessionToken();

  return sessionToken;
}