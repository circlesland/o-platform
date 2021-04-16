import { PlatformEventTypes } from "../eventTypes";
import {Signal} from "./signal";

export class EndSignal extends Signal
{
    constructor()
    {
        super(<PlatformEventTypes>"signal.end");
    }
}
