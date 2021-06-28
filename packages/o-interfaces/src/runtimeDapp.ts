import {DappManifest} from "./dappManifest";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {Topic} from "@o-platform/o-utils/dist/eventBroker";
import {StatePropagation} from "./statePropagation";
import {Signal} from "@o-platform/o-events/dist/signals/signal"
import {BehaviorSubject} from "rxjs";

export interface RuntimeDapp<TState extends {[x:string]:any}> extends DappManifest<TState>
{
  runtimeId:string,
  route: string,

  /**
   * Used by the auth to receive incoming events.
   */
  inEvents?:Topic<PlatformEvent>,
  /**
   * Used by the auth to send outgoing events for other dapps to subscribe.
   */
  outEvents?:Topic<PlatformEvent>,

  state: TState;
  setState: (state:TState) => void;

/*
  state: BehaviorSubject<StatePropagation<TState>>

  emitSignal: (signal:Signal) => void;
  emitState: (state:TState) => void;
 */
}
