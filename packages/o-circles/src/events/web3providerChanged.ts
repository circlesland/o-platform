import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {PlatformEventTypes} from "@o-platform/o-events/dist/eventTypes";

export class Web3providerChanged implements PlatformEvent {
    type: PlatformEventTypes = "circles.web3providerChanged";
}