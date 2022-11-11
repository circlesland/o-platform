/**
 * Contains environment variables which are filled in by webpack.
 */
export class Environment {
  public static get showLanguageSwitcher(): boolean {
    // @ts-ignore
    return "__SHOW_LANGUAGE_SWITCHER__" == "true";
  }

  public static get authEndpointUrl(): string {
    return "__AUTH_ENDPOINT__";
  }

  public static get apiEndpointUrl(): string {
    return "__API_ENDPOINT__";
  }

  public static get humanodeAuthUrl(): string {
    return "__HUMANODE_AUTH_URL__";
  }

  public static get humanodeTokenUrl(): string {
    return "__HUMANODE_TOKEN_URL__";
  }

  public static get humanodeRedirectUrl(): string {
    return "__HUMANODE_REDIRECT_URL__";
  }

  public static get humanodeClientId(): string {
    return "__HUMANODE_CLIENT_ID__";
  }

  public static get humanodeScope(): string {
    return "__HUMANODE_SCOPE__";
  }

  public static get appId(): string {
    return "__APP_ID__";
  }

  public static get externalUrl(): string {
    return "__EXTERNAL_URL__";
  }

  public static get filesAppId(): string {
    return "__FILES_APP_ID__";
  }

  public static get circlesGardenApiUrl(): string {
    return "__CIRCLES_GARDEN_API__";
  }

  public static get pathfinderEndpointUrl(): string {
    return "__PATHFINDER_ENDPOINT__";
  }

  public static get circlesSubgraphEndpoint(): string {
    return "__CIRCLES_SUBGRAPH_ENDPOINT__";
  }

  public static get circlesHubAddress(): string {
    return "__CIRCLES_HUB_ADDRESS__";
  }

  public static get circlesHubBlock(): number {
    return parseInt("__CIRCLES_HUB_BLOCK__");
  }

  public static get safeProxyFactoryAddress(): string {
    return "__SAFE_PROXY_FACTORY_ADDRESS__";
  }

  public static get masterSafeAddress(): string {
    return "__SAFE_ADDRESS__";
  }

  public static get xdaiRpcGatewayUrl(): string {
    return "__RPC_ENDPOINT__";
  }

  public static get useMockLogin(): boolean {
    // @ts-ignore
    return "__USE_MOCKS__" == "true";
  }

  public static get allowVerify(): boolean {
    // @ts-ignore
    return "__ALLOW_VERIFY__" == "true";
  }

  public static get allowCreateOrganisation(): boolean {
    // @ts-ignore
    return "__ALLOW_CREATE_ORGANISATION__" == "true";
  }

  public static get fixedGasPrice(): string {
    return "__FIXED_GAS_PRICE__";
  }

  public static get openLoginClientId(): string {
    return "__OPENLOGIN_CLIENT_ID__";
  }

  public static get hereApiKey(): string {
    return "__HERE_API_KEY__";
  }

  public static getShopMetadata(shopId: number): string {
    return localStorage.getItem("shopMetadata." + shopId);
  }
  public static setShopMetadata(shopId: number, data: string) {
    return localStorage.setItem("shopMetadata." + shopId, data);
  }
  public static get userLanguage(): string {
    if (!this.showLanguageSwitcher)
      return "en";

    if (localStorage.getItem("userLanguage")) {
      return localStorage.getItem("userLanguage");
    } else {
      return navigator.language.toLowerCase();
    }
  }
  public static set userLanguage(value: string) {
    localStorage.setItem("userLanguage", value);
  }

  public static getTestProfile(index: number): {
    privateKey: string;
    email: string;
    name: string;
    typeOfLogin: string;
    profileImage: string;
    aggregateVerifier: "not-verified";
    verifier: "not-verified";
    verifierId: "not-verified";
  } {
    if (!this.useMockLogin) throw new Error(`The built-in test keys can only be used if USE_MOCKS == true.`);

    const names = [
      "Chica Vahan",
      "Blandinus Ainura",
      "Sabeen Yechezkel",
      "Olivera Chana",
      "Pooja Kara",
      "Raghu Aina",
      "Roza Mileva",
      "Alexandra Tito",
      "Knut Danai",
      "Celal Azalaïs",
      "Michalina Palmiro",
      "Gry Aniruddha",
      "Baggi Toninho",
      "Jannatul Ferdous Ouranos",
      "Cináed Iancu",
      "Liubou Agnes",
      "Prachi Remus",
      "Tekakwitha Miia",
      "Luisito Preeti",
      "Charlize Sokol",
    ];
    const whitespace = new RegExp("\\s", "g");
    const emails = names.map((o) => o.replace(whitespace, ".")).map((o) => o + "@example.com");
    const pictures = [
      "https://images.unsplash.com/photo-1657781536566-1a1f6f5fea99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTExMA&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1657515726894-d65d0b3c868a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTExMQ&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1656254427882-65c088fc7d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTExMg&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1658335786123-b4b2b56a8c1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTExMw&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1658268887724-115013678353?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTExNA&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1656346080653-19076b703abc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTExNg&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1656199538175-54b9b7b8c2e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTExOA&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1658153099620-b88f2bf6168f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTExOQ&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1654036249671-134ea63bc3c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTExOQ&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1657766337557-7293f444c18e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTEyMQ&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1657597725143-73bb5dbcee4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTEyMg&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1656432606161-41c3071950ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTEyMw&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1656964078971-5b3df458d680?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTI1NA&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1658655186156-7a99573a7bec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTI1Nw&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1656231908917-41515e839d64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTI2Mg&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1656414564763-0fcd090ed83d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTI2Ng&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1656512020955-3cb9e505d024?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTI3MQ&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1658212668675-e7156a34ac45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTI4Mg&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1658009250465-374c761daeaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTMzMA&ixlib=rb-1.2.1&q=80&w=1080",
      "https://images.unsplash.com/photo-1656931251449-07493b9f6caf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY1ODg1NTMzMw&ixlib=rb-1.2.1&q=80&w=1080",
    ];
    const keys = [
      "0x471ae2170c3fea6a94f63f38e9a13faaf7bde116a9617fec9b931fc1837103c0",
      "0x939c97998709ef16010b78e1e810835bf5b6e71627a796d8c2a3f5ce20798f32",
      "0xa3e74498d19668762b4e03e19108c7670118a1544491cfc71c675352bf35959d",
      "0x1af7fec59ed782e73b029b477a6feec515c31c07b71f027221a03523493ef06a",
      "0x4193d7795f40015cfcf1bcf656cfb233c1abf766996f36be64a4acc3d137382f",
      "0xe42a8d7e22dca6b85f3303e9aa433a7e62ffced3c0a7217b2bedf430942e1037",
      "0x3ff6d2ecac97a077289029e869d67b34e51ad4a0d251f72c2cc4683eda9d4c88",
      "0x37ea3dfb478f4f6748d253e421ded2bc3c6bc94783fbeffc2d0c3edb429ee764",
      "0x53bd5f5a1ecc3ce6ae8aca2a95bca4df8ae14b7303913bfdb51106049475feb5",
      "0x4184fb76829ef21535922bbadc0d87b2aaf1f7705acdc52c6c2d6ee45f66e252",
      "0xacfca35e432c8926a7ecb6032327d12726a3136e7111226d09089d81adf6019b",
      "0xfa8c310701a8952474d8296843ff7fc16bf38f0cb5372682686c1a209514daf2",
      "0x43e92fbd323b2e2ec74626a0a7672cbdabe4d9061b20ba3117122328ecc6c8c4",
      "0x6bcbe47dbc8473ccba76682bb9f8895595359b74c8385fa73c5acbea6a04033e",
      "0x4562f9d7915589177575a9691306be618f3d1f04e63146df9cd110db324ea3b1",
      "0x62462f1170ca5466b8cc25b58b07fb7b75e8459fc7938be6088b5274d50c0944",
      "0x8e28e98c6df2fa973935e52d1372dc47b31543e9b8c1e13a892004bc0c6b31cc",
      "0xd2766d27c7c2610dea001771ddb1240b786259ee9805b4b608ac76b536bab2f7",
      "0x4a11d4624530d9379a2229e227bb52f14f09245af86739ca10ee42f297230f94",
    ];
    const profiles: {
      privateKey: string;
      email: string;
      name: string;
      typeOfLogin: string;
      profileImage: string;
      aggregateVerifier: "not-verified";
      verifier: "not-verified";
      verifierId: "not-verified";
    }[] = [];
    for (let i = 0; i < keys.length; i++) {
      const email = emails[i];
      const key = keys[i];
      const name = names[i];
      const picture = pictures[i];
      profiles.push({
        privateKey: key,
        name,
        email,
        profileImage: picture,
        typeOfLogin: "google",
        verifier: "not-verified",
        verifierId: "not-verified",
        aggregateVerifier: "not-verified",
      });
    }
    return profiles[index];
  }
}
