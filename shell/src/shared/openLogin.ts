import OpenLogin from "@toruslabs/openlogin";
import DirectWebSDK from "@toruslabs/torus-direct-web-sdk";

let openLogin: OpenLogin;
let torus: DirectWebSDK;

export async function getOpenLogin() {
  if (!openLogin) {
    openLogin = new OpenLogin({
      clientId: "BDDPr08kYwSJM7PW6dj7WR7C5IB64iloOcJBLjbdu8ZBOgOZ_8lxSMsmqbdCCZOBEWbFarpsgGOu5lmuQa8pl1c",
      network: "testnet",
      uxMode: "popup", // default is redirect , popup mode is also supported,
    });
    await openLogin.init();
  }

  return openLogin;
}