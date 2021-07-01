import { PlatformEvent } from "../platformEvent";
import { PlatformEventTypes } from "../eventTypes";
import {DappManifest} from "../../../o-interfaces/dist/dappManifest";
import {Routable} from "../../../o-interfaces/dist/routable";

export class DappLoading implements PlatformEvent {
  type: PlatformEventTypes = "shell.dappLoading";

  public readonly dappManifest:DappManifest<any>;
  public readonly routable: Routable;
  public readonly params: {[x:string]:any}

  constructor(dappManifest:DappManifest<any>, routable: Routable, params: {[x:string]:any})
  {
    this.dappManifest = dappManifest;
    this.routable = routable;
    this.params = params;
  }
}

export class DappLoaded implements PlatformEvent {
  type: PlatformEventTypes = "shell.dappLoaded";

  public readonly dappManifest:DappManifest<any>;
  public readonly routable: Routable;
  public readonly params: {[x:string]:any}

  constructor(dappManifest:DappManifest<any>, routable: Routable, params: {[x:string]:any})
  {
    this.dappManifest = dappManifest;
    this.routable = routable;
    this.params = params;
  }
}
