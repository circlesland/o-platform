import { IShell } from "./shell";
import { ProcessContext } from "@o-platform/o-process/dist/interfaces/processContext";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { Environment } from "./shared/environment";
import dayjs from "dayjs";
import * as bip39 from "bip39";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
RpcGateway.setup(Environment.xdaiRpcGatewayUrl);

// TODO: Use a service like 'https://github.com/ipfs/js-ipfs/blob/6870873f0696bb5d8d91fce4a4ef1f7420443993/packages/ipfs-message-port-server/src/server.js#L134'
//       to share data between different app domains.
declare global {
  interface Window {
    o: IShell;
    i18n: (id: string, options?: any) => string;
  }
}

export enum Role {
  User = "USER",
  Admin = "ADMIN",
}

export async function getProcessContext(): Promise<ProcessContext<any>> {
  return <ProcessContext<any>>{
    data: {},
  };
}

(<any>window).rpcGateway = RpcGateway.get();

import App from "src/App.svelte";

console.log(
  "asdas:",
  bip39.entropyToMnemonic("009626dAdEd5E90aECee30AD3EBf2b3E510FE256")
);

console.log(
  "rock@tho:",
  bip39.entropyToMnemonic("1981993ba9ab53ef41b7573198299589d477e948")
);

console.log(
  "Lizzy:",
  bip39.entropyToMnemonic("b748d590073a766b1D58A040f93add10106FabBb")
);

export default new App({
  target: document.body,
});
