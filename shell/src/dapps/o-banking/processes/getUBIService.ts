import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {CirclesAccount} from "@o-platform/o-circles/dist/model/circlesAccount";
import {GetUbiContext} from "./getUbi";
import {Subscription} from "rxjs";
import {CreateTagInput, RequestIndexTransactionDocument} from "../data/api/types";

export const getUBIService = async (context:GetUbiContext) => {
    const gnosisSafeProxy = new GnosisSafeProxy(RpcGateway.get(), context.data.safeAddress);
    const circlesAccount = new CirclesAccount(context.data.safeAddress);
    const result = await circlesAccount.getUBI(context.data.privateKey, gnosisSafeProxy);

    let txHashSubscription: Subscription;
    txHashSubscription = result.observable.subscribe(async o => {
        if (o.type != "transactionHash") {
            return;
        }
        if (txHashSubscription) {
            txHashSubscription.unsubscribe();
        }

        const transactionTags: CreateTagInput[] = [];
        const api = await window.o.apiClient.client.subscribeToResult();
        await api.mutate({
            mutation: RequestIndexTransactionDocument,
            variables: {
                data: {
                    tags: transactionTags,
                    transactionHash: o.data
                }
            }
        });
    });

    return await result.toPromise();
};