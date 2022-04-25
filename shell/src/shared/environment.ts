/**
 * Contains environment variables which are filled in by webpack.
 */
export class Environment {
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
}
