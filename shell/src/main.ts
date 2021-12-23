import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {IShell} from "./shell";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import App from "src/App.svelte";
import * as bip39 from "bip39";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {Environment} from "./shared/environment";
dayjs.extend(relativeTime)
RpcGateway.setup(Environment.xdaiRpcGatewayUrl, parseInt(Environment.fixedGasPrice));

// TODO: Use a service like 'https://github.com/ipfs/js-ipfs/blob/6870873f0696bb5d8d91fce4a4ef1f7420443993/packages/ipfs-message-port-server/src/server.js#L134'
//       to share data between different app domains.
declare global {
  interface Window {
    o: IShell
  }
}

export enum Role {
  User = 'USER',
  Admin = 'ADMIN'
}

export async function getProcessContext(): Promise<ProcessContext<any>> {
  return <ProcessContext<any>>{
    data: {}
  };
}

// window.runInitMachine();
//--account="0x5bc6328efff9fc724aad89edf1356a6ba7bee56368b4b9b47b1f29a5cd6d73c7,100000000000000000000" \
//--account="0x89e62e74143e15eaba362a67f8d71e5371d1268e1769b2613b8483024d17e110,100000000000000000000" \
//--account="0xd0f7cc8f8e7d9e10fbf51d8ac39f390acf52bfa96224fb5cff6b189c1a68f328,100000000000000000000" \
//--account="0x8a49c61f64ed99f8a59a9bd62cd39238f7256beead025b86e25476e329637b93,100000000000000000000"
console.log(bip39.entropyToMnemonic("5bc6328efff9fc724aad89edf1356a6ba7bee56368b4b9b47b1f29a5cd6d73c7"));

export default new App({
  target: document.body,
});