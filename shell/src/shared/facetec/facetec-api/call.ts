import {Config} from "../config";
import {FaceTecSDK} from "../facetec-sdk/core-sdk/FaceTecSDK.js/FaceTecSDK";

export async function postToFacetecApi(
  sessionId: string,
  path:string,
  body:any) {
  const postResult = await fetch(Config.BaseURL + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Device-Key": Config.DeviceKeyIdentifier,
      "X-User-Agent": FaceTecSDK.createFaceTecAPIUserAgentString(sessionId)
    },
    body: JSON.stringify(body)
  });

  const postResultJson = await postResult.json();
  if (!postResultJson.success) {
    throw new Error(`The call to '${path}' failed: ${JSON.stringify(postResultJson)}`);
  }

  return postResultJson;
}