import {actions, AnyEventObject} from "xstate";
import {IProcessContext} from "../interfaces/processContext";
//const {escalate} = actions;

/**
 * A generic error state that escalates the error.
 */
export function fatalError<TContext extends IProcessContext, TEvent extends AnyEventObject>(stateName:string) : {
    [x:string]: {
        id:string,
        type:"final" | "atomic" | "compound" | "parallel" | "history",
        entry:any
    }
} {
    const states: {
        [x:string]:{
            id:string,
            type:"final" | "atomic" | "compound" | "parallel" | "history",
            entry:any
        }
    } = {};
    states[stateName] ={
        id: stateName,
        type: 'final',
        // TODO: Check out how to properly propagate errors in the statechart
        //entry: escalate((context:TContext, event: TEvent) =>new Error(`Original error: ${JSON.stringify(event)}`))
        entry: (context:any, event:any) => {
            throw new Error(`Original error: ${JSON.stringify(event)}`)
        }
    };
    return states;
}