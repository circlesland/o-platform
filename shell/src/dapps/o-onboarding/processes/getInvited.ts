import {createMachine, send, sendParent} from "xstate";

export type GetInvitedContext = {
    profileId: number;
    email: string;
    acceptedToSVersion: string;
    subscribedToNewsletter: boolean;
}

export type GetInvitedEvent = {
    type: "CANCEL"
} | {
    type: "GOT_INVITED"
}

export const getInvitedMachine = createMachine<GetInvitedContext, GetInvitedEvent>({
    initial: "getInvited",
    context: {
        profileId: null,
        email: null,
        acceptedToSVersion: null,
        subscribedToNewsletter: null
    },
    states: {
        getInvited: {
            invoke: {src: "promptGetInvited"},
            activities: "waitForInvitation",
            on: {
                GOT_INVITED: {
                    target: "success"
                }
            }
        },
        success: {
            type: "final",
            entry: sendParent({type: "GOT_INVITED"})
        }
    }
}, {
    services: {
        promptGetInvited: async (context, event) => {}
    },
    activities: {
        waitForInvitation: () => {
            // TODO: Subscribe to the profile's event stream and wait for an invitation
            const interval = setInterval(() => {
                // console.log('Waiting for invitation ..');
                send({type: "GOT_INVITED"});
            }, 1000);

            // Return a function that stops the beeping activity
            return () => clearInterval(interval);
        }
    }
});