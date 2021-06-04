import {ProcessDefinition} from "@o-platform/o-process/dist/interfaces/processManifest";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {ProcessContext} from "@o-platform/o-process/dist/interfaces/processContext";
import {createMachine, actions} from "xstate";
import {Bubble} from "@o-platform/o-process/dist/events/bubble";
import {show} from "@o-platform/o-process/dist/actions/show";
import {ipcSinker} from "@o-platform/o-process/dist/triggers/ipcSinker";
const {send} = actions;

export class ShellProcessContext extends ProcessContext<any> {
  childProcessId: string;
  childProcessDefinition:ProcessDefinition<any,any>
  childContext? :{[x:string]:any};
}

/**
 * Wraps a process and provides shell services to it.
 */
const processDefinition = () => {
  const processId = `shellProcess:${Date.now()}`;
  const childProcessId = `${processId}:child`

  return createMachine<ShellProcessContext, PlatformEvent>({
    id: processId,
    initial: "idle",
    states: {
      idle: {
        on: {
          "*": "run"
        }
      },
      run: {
        // entry: (context) => console.log(`shellProcess: run ${context.childProcessDefinition.name}`),
        invoke: {
          id: childProcessId,
          src: context => {
            const sm = context.childProcessDefinition.stateMachine(childProcessId);
            console.log(`invoking child process: ${sm.id}`)
            return <any>sm; // TODO: Fix 'any'
          },
          data: (context) => {
            const newChildContext:ProcessContext<any> = {
              data:{},
              messages:{},
              dirtyFlags:{},
              environment:{}
            };
            if (context.childContext) {
              Object.keys(context.childContext).forEach(key => {
                newChildContext[key] = context.childContext[key];
              });
            }
            return newChildContext
          },
          onError: "showError",
          onDone: [{
            cond: (context, event: { type:string, data: any }) => !event.data,
            target: "showError"
          }, {
            target: "finished"
          }]
        },

        on: {
          //
          // Global event handlers
          //
          "process.cancel": "cancelled",

          //
          // IPC events
          //
          // When in 'run' state, forward all sinking events to the child process
          // TODO: fix any cast
          ...<any>ipcSinker(childProcessId),
          "process.ipc.bubble": {
            cond: (context, event:Bubble) => event.trace[event.trace.length - 1] !== childProcessId,
            actions: [
              send((context, event) => {
                const bubble = <Bubble>event;
                return <Bubble>{
                  end: true,
                  type: "process.ipc.bubble",
                  levels: bubble.levels + 1,
                  tag: bubble.tag,
                  wrappedEvent: bubble.wrappedEvent,
                  trace: bubble.trace.concat([childProcessId])
                };
              }),
              //(context, event) => console.log("shellProcess: piping out a received bubbling event:", event)
            ]
          }
        }
      },
      showError: {
        entry: [
          (context, event) => console.log("ShellProcess encountered an error:", event),
          <any>show({ // TODO: fix <any> cast
            component: Error,
            params: {},
            field: {
              name: "",
              get:() => undefined,
              set:(o:any) => {}
            }
          }
        )],
        on: {
          "process.continue": {
            target: "run",
            actions: send("process.continue")
          },
          "process.cancel": {target: "error"}
        }
      },
      cancelled: {
        id: "cancelled",
        entry: () => console.log("shellProcess: cancelled"),
        type: 'final',
        data: () => false
      },
      finished: {
        entry: () => console.log("shellProcess: finished"),
        type: 'final',
        data: () => true// TODO: Don't discard the result
      },
      error: {
        entry: () => console.log("shellProcess: error"),
        type: 'final',
        data: () => false// TODO: Don't discard the result
      }
    }
  });
}
export const shellProcess: ProcessDefinition<{
  childProcessDefinition:ProcessDefinition<any,any>
  childContext? :ProcessContext<any>;
}, any> = {
  name: "shellProcess",
  stateMachine: <any>processDefinition
};