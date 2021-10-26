import OpenLogin from "@toruslabs/openlogin";

let openLogin: OpenLogin;

export async function getOpenLogin() {
  if (!openLogin) {
    openLogin = new OpenLogin({
      clientId: "BHG9boVJt-AxjEnMF3hEdR-CGVO7ust-Vgbu2UTvvamcg-Ora8EpJ-iYXWeskqFlUs7Q3j1sS3Ns4qxEH4311ck",
      network: "mainnet",
      uxMode: "popup", // default is redirect , popup mode is also supported
    });
    await openLogin.init();
  }

  return openLogin;
}