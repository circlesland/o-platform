import OpenLogin, {OpenloginUserInfo} from "@toruslabs/openlogin";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {Environment} from "./environment";

let openLogin: OpenLogin;

export type GetOpenLoginResult = OpenLogin|{login(args:any):{privKey:string}, getUserInfo():{userInfo:any}, logout():Promise<void>};

export async function getOpenLogin(): Promise<GetOpenLoginResult> {
  if (Environment.useMockLogin)
  {
    return <GetOpenLoginResult>{
      async login(params: any): Promise<{ privKey: string }> {
        const acc = RpcGateway.get().eth.accounts.create();
        return {
          privKey: acc.privateKey
        };
      },
      async getUserInfo(): Promise<OpenloginUserInfo> {
        return {
          email: "email@some.hostname.of.some.mailserver.somewhere",
          name: "Oauth profile name",
          typeOfLogin: "google",
          profileImage: "https://some.url.to.somewhere",
          aggregateVerifier: "not-verified",
          verifier: "not-verified",
          verifierId: "not-verified"
        }
      }
    };
  }

  if (!openLogin) {
    openLogin = new OpenLogin({
      clientId: Environment.openLoginClientId,
      network: "mainnet",
      uxMode: "popup", // default is redirect , popup mode is also supported
    });
    await openLogin.init();
  }

  return openLogin;
}