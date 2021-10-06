import OpenLogin from "@toruslabs/openlogin";
import DirectWebSDK from "@toruslabs/torus-direct-web-sdk";

let openLogin: OpenLogin;
let torus: DirectWebSDK;

export async function getOpenLogin() {

  if (!torus) {
    torus = new DirectWebSDK({
      baseUrl: document.location.protocol + "//" + document.location.host,
      network: "testnet",
      redirectPathName: "redirect.html",
      uxMode: "popup"
    });
    await torus.init()
  }
  /*
  if (!openLogin) {
    openLogin = new OpenLogin({
      //clientId: "BI3cr1l8ztZhkaRFFsh2cY77o6H74JHP0KaigRdh30Y53YDpMatb9QDiPh14zl176ciAUMbi7JlmjNe5MPLwzAE",
      clientId: "BDDPr08kYwSJM7PW6dj7WR7C5IB64iloOcJBLjbdu8ZBOgOZ_8lxSMsmqbdCCZOBEWbFarpsgGOu5lmuQa8pl1c",
      //clientId: "BI3cr1l8ztZhkaRFFsh2cY77o6H74JHP0KaigRdh30Y53YDpMatb9QDiPh14zl176ciAUMbi7JlmjNe5MPLwzAE",
      network: "testnet",
      redirectUrl: "http://localhost:5000/"
    });
    await openLogin.init();
  }
 */

  return torus;
}