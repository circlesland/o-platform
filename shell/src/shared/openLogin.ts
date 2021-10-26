import OpenLogin from "@toruslabs/openlogin";

let openLogin: OpenLogin;

export async function getOpenLogin() {
  if (!openLogin) {
    openLogin = new OpenLogin({
      clientId: "BDRsIztLb9k7boO6mmiQXudEiF0FaIuQEOtB06Ege7BklGMXV9j5xKIQw5O7IFMo5cDxMRi11X_jXT3JDqzr1jk",
      network: "testnet",
      uxMode: "popup", // default is redirect , popup mode is also supported
    });
    await openLogin.init();
  }

  return openLogin;
}