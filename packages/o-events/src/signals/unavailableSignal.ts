import { PlatformEventTypes } from "../eventTypes";
import {Signal} from "./signal";

export class UnavailableSignal extends Signal
{
    constructor()
    {
        super(<PlatformEventTypes>"signal.unavailable");
    }
}
