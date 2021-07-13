import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {TransitivePath} from "../processes/transferCircles";

export async function requestPathToRecipient (context:{data:{safeAddress:string; amount?:string, recipientAddress:string}}) {
    const circlesValueInWei = RpcGateway.get().utils
      .toWei(context.data.amount?.toString() ?? "0", "ether")
      .toString();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const response = await fetch(
        `__PATHFINDER_ENDPOINT__/flow/${context.data.safeAddress}/${context.data.recipientAddress}/${circlesValueInWei.toString()}`);
    const result = await response.json();

    console.log("Transitive path is: ", result);

    return <TransitivePath>result;
}