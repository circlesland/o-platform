import {actions} from "xstate";
import {Sinker} from "../events/sinker";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {IProcessContext} from "../interfaces/processContext";
const {send} = actions;

export function ipcSinker<TContext extends IProcessContext>(id: string) {
  return {
    "process.ipc.sinker": [{
      // Unwrap and send
      cond: (context: TContext, event: Sinker) => {
        return event.levels == 1;
      },
      actions: send((context: TContext, event: Sinker) => {
        return event.wrappedEvent;
      }, {
        to: (context: TContext, event: Sinker) => {
          const id = event.backTrace.pop()
          if (!id)
            throw new Error(`Arrived at tne last level of the backtrace. Cannot sink any deeper.. :/`);

          return id;
        }
      })
    }, {
      // Let it continue to sink
      cond: (context: TContext, event: Sinker) => {
        return event.levels > 0
            && (!event.trace?.length || event.trace[event.trace.length - 1] != id)
      },
      actions: send((context: TContext, event: Sinker) => {
        const newSinker = <PlatformEvent>{
          type: "process.ipc.sinker",
          levels: event.levels - 1,
          tag: event.tag,
          wrappedEvent: event.wrappedEvent,
          trace: event.trace?.concat([id]) ?? [id],
          backTrace: event.backTrace
        };
        return newSinker;
      }, {
        to: (context: TContext, event: Sinker) => {
          const id = event.backTrace.pop()
          if (!id)
            throw new Error(`Arrived at tne last level of the backtrace. Cannot sink any deeper.. :/`);

          return id;
        }
      })
    }]
  }
}