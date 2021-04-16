import { PlatformEventTypes } from "../eventTypes";
import {Signal} from "./signal";

export class BeginSignal extends Signal
{
    constructor()
    {
        super(<PlatformEventTypes>"signal.begin");
    }
}
