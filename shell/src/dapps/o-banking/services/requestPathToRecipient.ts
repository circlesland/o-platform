import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {TransitivePath} from "../processes/transferCircles";

export async function requestPathToRecipient (context:{data:{safeAddress:string; amount?:string, recipientAddress:string}}) {
    const circlesValueInWei = RpcGateway.get().utils
      .toWei(context.data.amount?.toString() ?? "0", "ether")
      .toString();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // https://rpc.circles.land/pathfinder/flow/0xDE374ece6fA50e781E81Aac78e811b33D16912c7/0x3709677D5a7099F07cA2a1B40690dFcAbe661AFd/9999999000000000000000000000000000000000000
    const response = await fetch(
        `__PATHFINDER_ENDPOINT__/flow/${context.data.safeAddress}/${context.data.recipientAddress}/${circlesValueInWei.toString()}`);
    const result = await response.json();

    // console.log("Transitive path is: ", result);

    return <TransitivePath>result;
}