import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {EventBroker} from "@o-platform/o-utils/dist/eventBroker";

const eventBroker = new EventBroker();
export const shellEvents = eventBroker.createTopic<PlatformEvent>("o", "shell");
