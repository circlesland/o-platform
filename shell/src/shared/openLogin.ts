import OpenLogin from "@toruslabs/openlogin";

let openLogin: OpenLogin;

export async function getOpenLogin() {
  if (!openLogin) {
    openLogin = new OpenLogin({
      clientId: "__OPENLOGIN_CLIENT_ID__",
      network: "mainnet",
      uxMode: "popup", // default is redirect , popup mode is also supported
    });
    await openLogin.init();
  }

  return openLogin;
}