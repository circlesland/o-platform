import OpenLogin, {OpenloginUserInfo} from "@toruslabs/openlogin";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

let openLogin: OpenLogin;

export type GetOpenLoginResult = OpenLogin|{login(args:any):{privKey:string}, getUserInfo():{userInfo:any}, logout():Promise<void>};

export async function getOpenLogin(): Promise<GetOpenLoginResult> {
  // @ts-ignore - '__USE_MOCKS__' is replaced by the build process
  if ("__USE_MOCKS__" == "true")
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
          email: "deine.muuda@kocht.ohne_salz",
          name: "Meine mudda kocht ohne Salz",
          typeOfLogin: "Muddas Login",
          profileImage: "Bild vong Deine Mudda",
          aggregateVerifier: "Nix",
          verifier: "Ich",
          verifierId: "Nada"
        }
      }
    };
  }

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