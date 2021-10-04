import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";

export const hasKey = () => {
  const key = sessionStorage.getItem("circlesKey");
  if (!key)
    return false;

  try {
    const account = RpcGateway.get().eth.accounts.privateKeyToAccount(key);
    return !!account;
  } catch (e) {
    console.error(`Couldn't load the private key from the localStorage.`)
    return false;
  }
}