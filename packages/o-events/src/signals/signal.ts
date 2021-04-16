import { PlatformEvent } from "../platformEvent";
import { PlatformEventTypes } from "../eventTypes";

export abstract class Signal implements PlatformEvent
{
    readonly type: PlatformEventTypes;
    readonly timestamp: number = Date.now();

    constructor(type:PlatformEventTypes)
    {
        this.type = type;
    }
}
