import {Signal} from "@o-platform/o-events/dist/signals/signal";

/**
 * Can be used with a BehaviorSubject to propagate state changes trough multiple dapps.
 */
export interface StatePropagation<TContent>
{
  signal:Signal,
  payload?:TContent
}
