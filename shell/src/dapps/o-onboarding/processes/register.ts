import {createMachine, send, sendParent} from "xstate";
import {RegistrationData} from "./init";

export type RegistrationContext = {
    profileId: number;
    email: string;
    acceptedToSVersion: string;
    subscribedToNewsletter: boolean;
}

export type RegistrationEvent = {
    type: "CANCEL"
} | {
    type: "CANCELLED"
}| {
    type: "REGISTERED",
    registration: RegistrationData
}| {
    type: "NOT_REGISTERED"
}| {
    type: "SUBMIT"
}

export const registerMachine = createMachine<RegistrationContext, RegistrationEvent>({
    id: `register`,
    initial: "newsletter",
    context: {
        profileId: null,
        email: null,
        acceptedToSVersion: null,
        subscribedToNewsletter: null
    },
    on: {
        CANCEL: "cancelled"
    },
    states: {
        newsletter: {
            invoke: {src: "promptNewsletter"},
            on: {
                SUBMIT: {
                    actions: "assignNewsletterToContext",
                    target: "register"
                }
            }
        },
        register: {
            invoke: {src: "upsertRegistration"},
            on: {
                REGISTERED: {
                    target: "success"
                },
                NOT_REGISTERED: {
                    actions: send({type: "CANCEL"})
                }
            }
        },
        cancelled: {
            type: "final",
            entry: sendParent({type: "CANCELLED"})
        },
        success: {
            type: "final",
            entry: sendParent({type: "REGISTERED"})
        }
    }
}, {
    services: {
        promptNewsletter: async (context, event) => {},
        upsertRegistration: async (context, event) => {
            send({type: "CANCEL"});
            send({type: "REGISTERED", registration: {
                    profileId: 0,
                    email: "",
                    acceptedToSVersion: "",
                    subscribedToNewsletter: true
            }});
        }
    },
    actions: {
        assignNewsletterToContext: (context, event) => {}
    }
});