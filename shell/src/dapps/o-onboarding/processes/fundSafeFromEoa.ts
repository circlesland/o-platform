import {createMachine, send, sendParent} from "xstate";

export type FundSafeFromEoaContext = {
    profileId: number;
    email: string;
    acceptedToSVersion: string;
    subscribedToNewsletter: boolean;
}

export type FundSafeFromEoaEvent = {
    type: "CANCEL"
} | {
    type: "CANCELLED"
} | {
    type: "FUNDED"
}

export const fundSafeFromEoa = createMachine<FundSafeFromEoaContext, FundSafeFromEoaEvent>({
    initial: "success",
    context: {
        profileId: null,
        email: null,
        acceptedToSVersion: null,
        subscribedToNewsletter: null
    },
    states: {
        cancelled: {
            type: "final",
            entry: sendParent({type: "CANCELLED"})
        },
        success: {
            type: "final",
            entry: sendParent({type: "FUNDED"})
        }
    }
}, {
    services: {}
});