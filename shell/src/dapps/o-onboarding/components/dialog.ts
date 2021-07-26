import {assign, createMachine, send, sendParent, spawn} from "xstate";

export type PromptContext = {
    component: any
    params: {[x:string]:any},
    canSkip: boolean,
    canGoBack: boolean,
    canCancel: boolean,
    canSubmit: boolean,
    _shellInterface: any
}

export type PromptEvent = {
    type: "SHOW",
    prompt: {
        component: any
        params: { [x: string]: any },
        canSkip: boolean,
        canGoBack: boolean,
        canCancel: boolean,
        canSubmit: boolean
    }
} | {
    type: "BACK"
} | {
    type: "SKIP"
} | {
    type: "SUBMIT"
} | {
    type: "CANCEL"
} | {
    type: "CHANGED"
} | {
    type: "SUBMITTED",
    value: any
}

const shellInterface = (callback, receive) => {
    receive(event => window.o.modal.prompt(event, callback));
    return () => {/* Put cleanup logic here */}
}

export const promptMachine = createMachine<PromptContext, PromptEvent>({
    initial: "show",
    context: {
        component: null,
        params: null,
        canSkip: null,
        canGoBack: null,
        canCancel: null,
        canSubmit: null,
        _shellInterface: null
    },
    states: {
        show: {
            entry: [
                (ctx) => console.log("promptMachine.show. Context:", ctx),
                assign({
                    _shellInterface: () => spawn(shellInterface)
                })
            ],
            always: "unchanged"
        },
        unchanged: {
            entry: [
                (ctx) => console.log("promptMachine.unchanged. Context:", ctx),
                send((ctx) => {return {type: "SHOW", prompt: {...ctx}}}, {to: (ctx) => ctx._shellInterface})
            ],
            on: {
                CHANGED: {
                    actions: (ctx) => console.log("promptMachine.unchanged.CHANGED. Context:", ctx),
                    target: "changed"
                },
                BACK: {
                    cond: (ctx) => ctx.canGoBack,
                    actions: (ctx) => console.log("promptMachine.unchanged.BACK. Context:", ctx)
                },
                SKIP: {
                    cond: (ctx) => ctx.canSkip,
                    actions: (ctx) => console.log("promptMachine.unchanged.SKIP. Context:", ctx)
                },
                CANCEL: {
                    cond: (ctx) => ctx.canCancel,
                    actions: (ctx) => console.log("promptMachine.unchanged.CANCEL. Context:", ctx)
                },
                SUBMIT: {
                    cond: (ctx) => ctx.canSubmit,
                    actions: (ctx) => console.log("promptMachine.unchanged.SUBMIT. Context:", ctx)
                }
            }
        },
        changed: {
            entry: (ctx) => console.log("promptMachine.changed. Context:", ctx),
            on: {
                CHANGED: {
                    actions: (ctx) => console.log("promptMachine.changed.CHANGED. Context:", ctx),
                    target: "changed"
                },
                BACK: {
                    cond: (ctx) => ctx.canGoBack,
                    actions: (ctx) => console.log("promptMachine.unchanged.BACK. Context:", ctx)
                },
                SKIP: {
                    cond: (ctx) => ctx.canSkip,
                    actions: (ctx) => console.log("promptMachine.unchanged.SKIP. Context:", ctx)
                },
                CANCEL: {
                    cond: (ctx) => ctx.canCancel,
                    actions: (ctx) => console.log("promptMachine.unchanged.CANCEL. Context:", ctx)
                },
                SUBMIT: {
                    cond: (ctx) => ctx.canSubmit,
                    actions: (ctx) => console.log("promptMachine.unchanged.SUBMIT. Context:", ctx)
                }
            }
        },
        waiting: {
            entry: (ctx) => console.log("promptMachine.waiting. Context:", ctx)
        }
    }
}, {
    services: {
        dialog: (ctx) => (callback) => {

        }
    }
});