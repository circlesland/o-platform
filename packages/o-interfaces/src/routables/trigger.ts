import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Routable} from "../routable";
import {DappManifest} from "../dappManifest";

/**
 * Sends an event when a user navigated to the associated route.
 */
export interface Trigger extends Routable {
    type: "trigger";
    eventFactory: (params:{[x:string]:any}|undefined, runtimeDapp: DappManifest<any>) => PlatformEvent;
}