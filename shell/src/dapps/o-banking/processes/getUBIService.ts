import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {CirclesAccount} from "@o-platform/o-circles/dist/model/circlesAccount";
import {GetUbiContext} from "./getUbi";

export const getUBIService = async (context:GetUbiContext) => {
    const gnosisSafeProxy = new GnosisSafeProxy(RpcGateway.get(), context.data.safeAddress);
    const circlesAccount = new CirclesAccount(context.data.safeAddress);
    const result = await circlesAccount.getUBI(context.data.privateKey, gnosisSafeProxy);
    return await result.toPromise();
};