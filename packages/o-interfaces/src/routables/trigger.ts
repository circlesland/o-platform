import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Routable} from "../routable";
import {DappManifest} from "../dappManifest";
import {Jumplist} from "./jumplist";

/**
 * Sends an event when a user navigated to the associated route.
 */
export interface Trigger<TParams extends {[x:string]:any}, TDappState extends {[x:string]:any}> extends Routable {
    type: "trigger";
    eventFactory: (params:TParams, runtimeDapp: DappManifest<any>) => PlatformEvent;
    jumplist?: Jumplist<TParams, TDappState>
}