import OpenLogin from "@toruslabs/openlogin";

let openLogin: OpenLogin;

export async function getOpenLogin() {
  if (!openLogin) {
    openLogin = new OpenLogin({
      clientId: "BDDPr08kYwSJM7PW6dj7WR7C5IB64iloOcJBLjbdu8ZBOgOZ_8lxSMsmqbdCCZOBEWbFarpsgGOu5lmuQa8pl1c",
      //clientId: "BI3cr1l8ztZhkaRFFsh2cY77o6H74JHP0KaigRdh30Y53YDpMatb9QDiPh14zl176ciAUMbi7JlmjNe5MPLwzAE",
      network: "testnet",
      // redirectUrl: "http://localhost:5000/#/banking/transactions", // your app url where user will be redirected
      uxMode: "popup", // default is redirect , popup mode is also supported,
    });
    await openLogin.init();
  }

  return openLogin;
}