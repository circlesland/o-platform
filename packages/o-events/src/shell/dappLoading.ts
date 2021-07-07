import { PlatformEvent } from "../platformEvent";
import { PlatformEventTypes } from "../eventTypes";

export class DappLoading implements PlatformEvent {
  type: PlatformEventTypes = "shell.dappLoading";

  public readonly dappId:string;
  public readonly params: {[x:string]:any}

  constructor(dappId:string, params: {[x:string]:any})
  {
    this.params = params;
    this.dappId = dappId;
  }
}

export class DappLoaded implements PlatformEvent {
  type: PlatformEventTypes = "shell.dappLoaded";

  public readonly dappId:string;
  public readonly params: {[x:string]:any}

  constructor(dappId:string, params: {[x:string]:any})
  {
    this.params = params;
    this.dappId = dappId;
  }
}
