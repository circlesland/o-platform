import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

export const hasKey = () => {
  const key = sessionStorage.getItem("circlesKey");
  if (!key)
    return false;

  try {
    const account = RpcGateway.get().eth.accounts.privateKeyToAccount(key);
    return !!account;
  } catch (e) {
    console.error(window.i18n("dapps.o-passport.processes.identify.conds.hasKey.error"))
    return false;
  }
}