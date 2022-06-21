/**
 * Contains environment variables which are filled in by webpack.
 */
export class Environment {
  public static get authEndpointUrl(): string {
    return import.meta.env.AUTH_ENDPOINT;
  }

  public static get apiEndpointUrl(): string {
    return import.meta.env.API_ENDPOINT;
  }

  public static get humanodeAuthUrl(): string {
    return import.meta.env.HUMANODE_AUTH_URL;
  }

  public static get humanodeTokenUrl(): string {
    return import.meta.env.HUMANODE_TOKEN_URL;
  }

  public static get humanodeRedirectUrl(): string {
    return import.meta.env.HUMANODE_REDIRECT_URL;
  }

  public static get humanodeClientId(): string {
    return import.meta.env.HUMANODE_CLIENT_ID;
  }

  public static get humanodeScope(): string {
    return import.meta.env.HUMANODE_SCOPE;
  }

  public static get appId(): string {
    return import.meta.env.APP_ID;
  }

  public static get externalUrl(): string {
    return import.meta.env.EXTERNAL_URL;
  }

  public static get filesAppId(): string {
    return import.meta.env.FILES_APP_ID;
  }

  public static get circlesGardenApiUrl(): string {
    return import.meta.env.CIRCLES_GARDEN_API;
  }

  public static get pathfinderEndpointUrl(): string {
    return import.meta.env.PATHFINDER_ENDPOINT;
  }

  public static get circlesSubgraphEndpoint(): string {
    return import.meta.env.CIRCLES_SUBGRAPH_ENDPOINT;
  }

  public static get circlesHubAddress(): string {
    return import.meta.env.CIRCLES_HUB_ADDRESS;
  }

  public static get circlesHubBlock(): number {
    return parseInt(import.meta.env.CIRCLES_HUB_BLOCK);
  }

  public static get safeProxyFactoryAddress(): string {
    return import.meta.env.SAFE_PROXY_FACTORY_ADDRESS;
  }

  public static get masterSafeAddress(): string {
    return import.meta.env.SAFE_ADDRESS;
  }

  public static get xdaiRpcGatewayUrl(): string {
    return import.meta.env.RPC_ENDPOINT;
  }

  public static get useMockLogin(): boolean {
    // @ts-ignore
    return import.meta.env.USE_MOCKS == "true";
  }

  public static get allowVerify(): boolean {
    // @ts-ignore
    return import.meta.env.ALLOW_VERIFY == "true";
  }

  public static get allowCreateOrganisation(): boolean {
    // @ts-ignore
    return import.meta.env.ALLOW_CREATE_ORGANISATION == "true";
  }

  public static get fixedGasPrice(): string {
    return import.meta.env.FIXED_GAS_PRICE;
  }

  public static get openLoginClientId(): string {
    return import.meta.env.OPENLOGIN_CLIENT_ID;
  }

  public static getShopMetadata(shopId: number): string {
    return localStorage.getItem("shopMetadata." + shopId);
  }
  public static setShopMetadata(shopId: number, data: string) {
    return localStorage.setItem("shopMetadata." + shopId, data);
  }
}
