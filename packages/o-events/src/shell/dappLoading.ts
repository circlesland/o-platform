import { PlatformEvent } from "../platformEvent";
import { PlatformEventTypes } from "../eventTypes";

export class DappLoading implements PlatformEvent {
  type: PlatformEventTypes = "shell.dappLoading";

  public readonly params: {[x:string]:any}

  constructor(params: {[x:string]:any})
  {
    this.params = params;
  }
}

export class DappLoaded implements PlatformEvent {
  type: PlatformEventTypes = "shell.dappLoaded";

  public readonly params: {[x:string]:any}

  constructor(params: {[x:string]:any})
  {
    this.params = params;
  }
}
