import { StateMachine } from "xstate";
import {ProcessContext} from "./processContext";

export interface ProcessManifest {
  id?: number;
  name: string;
}

export interface ProcessDefinition<TIn, TOut> extends ProcessManifest {
  stateMachine: ((processId?:string) =>
      StateMachine<ProcessContext<any>, any, any>) | ((args: any) => StateMachine<ProcessContext<any>, any, any>);
}
