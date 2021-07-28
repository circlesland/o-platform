import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
import {dapps} from "../../loader";

export function findDappById(dappId:string) : DappManifest<any>|undefined {
    if (!dappId) {
        const defaultApp = dapps.find(
            (o) => o.routeParts && o.routeParts.length == 0
        );
        if (defaultApp) {
            dappId = defaultApp.dappId;
        } else {
            return undefined;
        }
    } else {
        dappId = dappId.endsWith(":1")
            ? dappId
            : dappId + ":1"; // TODO: Use the latest version instead of "1"
    }

    return dapps.find((o) => o.dappId == dappId);
}