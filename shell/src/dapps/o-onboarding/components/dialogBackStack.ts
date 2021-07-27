import {assign, createMachine, sendParent} from "xstate";
import {SHOW_PAGE} from "./dialog";

export type DialogBackStackContext = {
    stack: SHOW_PAGE[],
    poppedItem: SHOW_PAGE
}

export type DialogBackStackEvent = {
    type: "PUSH",
    content: SHOW_PAGE
} | {
    type: "PUSHED",
    content: SHOW_PAGE,
    size: number
} | {
    type: "POP"
} | {
    type: "POPPED",
    content: SHOW_PAGE,
    size: number
}

export const dialogBackStackMachine = createMachine<DialogBackStackContext, DialogBackStackEvent>({
    initial: "empty",
    context: {
        stack: [],
        poppedItem: null
    },
    states: {
        empty: {
            on: {
                PUSH: {
                    actions: [
                        "push",
                        sendParent((ctx, event) => {
                            return {
                                type: "PUSHED",
                                content: event.content,
                                size: ctx.stack.length
                            }
                        })
                    ],
                    target: "notEmpty"
                }
            }
        },
        notEmpty: {
            on: {
                PUSH: {
                    actions: [
                        "push",
                        sendParent((ctx, event) => {
                            return {
                                type: "PUSHED",
                                content: event.content,
                                size: ctx.stack.length
                            }
                        })
                    ]
                },
                POP: [{
                    actions: [
                        "pop",
                        sendParent((ctx) => {
                            return {
                                type: "POPPED",
                                content: ctx.poppedItem,
                                size: ctx.stack.length
                            }
                        })
                    ]
                }, {
                    cond: context => context.stack.length == 0,
                    target: "empty"
                }]
            }
        }
    }
}, {
    actions: {
        push: (ctx, event) => {
            if (event.type !== "PUSH")
                throw new Error(`Expected a PUSH event but got ${event.type}.`);

            ctx.stack.push(event.content);
        },
        pop: assign({
            poppedItem: (ctx) => ctx.stack.pop()
        }),
    }
});