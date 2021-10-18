import OpenLogin from "@toruslabs/openlogin";

let openLogin: OpenLogin;

export async function getOpenLogin() {
  if (!openLogin) {
    openLogin = new OpenLogin({
      clientId: "BDDPr08kYwSJM7PW6dj7WR7C5IB64iloOcJBLjbdu8ZBOgOZ_8lxSMsmqbdCCZOBEWbFarpsgGOu5lmuQa8pl1c",
      network: "testnet",
      uxMode: "popup", // default is redirect , popup mode is also supported
    });
    await openLogin.init();
  }

  return openLogin;
}