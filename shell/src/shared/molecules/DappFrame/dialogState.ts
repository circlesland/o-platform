import {createMachine, send, sendParent, spawn} from "xstate";

export type DialogStateContext = {
    component?: any
    params?: { [x: string]: any }
}

/**
 * The OPENING- and CLOSING-events are meant for the duration it takes to animate OPEN and CLOSE.
 */
export type DialogStateEvent = {
    type: "LOAD",
    component: any,
    params: { [x: string]: any }
} | {
    type: "OPEN"
} | {
    type: "OPENING"
} | {
    type: "OPENED"
} | {
    type: "CLOSE"
} | {
    type: "CLOSING"
} | {
    type: "CLOSED"
} | {
    type: "ERROR",
    error: Error
}

export const dialogMachine = createMachine<DialogStateContext, DialogStateEvent>({
    initial: "closed",
    context: {
        component: null,
        params: null
    },
    on: {
        ERROR: "error"
    },
    states: {
        opening: {
            entry: send({type: "OPENING"}),
            on: {
                OPENED: "open"
            }
        },
        open: {
            entry: send({type: "OPENED"}),
            on: {
                CLOSE: {
                },
                CLOSING: "closing"
            }
        },
        closing: {
            entry: send({type: "CLOSING"}),
            on: {
                CLOSED: "closed"
            }
        },
        closed: {
            entry: send({type: "CLOSED"}),
            on: {
                OPEN: {
                },
                OPENING: "opening"
            }
        },
        error: {
            type: "final"
        }
    }
}, {
    actions: { },
    services: { }
});