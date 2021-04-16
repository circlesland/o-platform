import { PlatformEventTypes } from "../eventTypes";
import {Signal} from "./signal";

export class ReadySignal extends Signal
{
    constructor()
    {
        super(<PlatformEventTypes>"signal.ready");
    }
}
