import {actions, assign, createMachine, send, sendParent, spawn} from "xstate";

export type GetInvitedContext = {
    _prompt: any;
}

export type GetInvitedEvent = {
    type: "CANCEL"
} | {
    type: "GOT_INVITED"
}

export const getInvitedMachine = createMachine<GetInvitedContext, GetInvitedEvent>({
    initial: "getInvited",
    context: {
        _prompt: null
    },
    states: {
        getInvited: {
            /*entry: assign({
                _prompt: () => spawn(promptMachine.withContext({
                    component: Test,
                    params: {
                        text: "Get invited!"
                    },
                    canSkip: false,
                    canGoBack: false,
                    canCancel: false,
                    canSubmit: false,
                    _shellInterface: null
                }))
            }),*/
            always: "waitForInvitation"
        },
        waitForInvitation: {
            invoke: {src: "waitForInvitation"},
            on: {
                GOT_INVITED: {
                    target: "success"
                }
            }
        },
        success: {
            type: "final",
            entry: [
                actions.stop(ctx => ctx._prompt),
                sendParent({type: "GOT_INVITED"})
            ]
        }
    }
}, {
    services: {
        waitForInvitation: (ctx) => (callback) => {
            // TODO: Subscribe to the profile's event stream and wait for an invitation
            console.log("waitForInvitation")
            // callback({type: "GOT_INVITED"});
        }
    }
});