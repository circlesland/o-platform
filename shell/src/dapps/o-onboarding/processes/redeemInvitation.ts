import {createMachine, send, sendParent} from "xstate";

export type RedeemInvitationContext = {
    profileId: number;
    email: string;
    acceptedToSVersion: string;
    subscribedToNewsletter: boolean;
}

export type RedeemInvitationEvent = {
    type: "CANCEL"
} | {
    type: "REDEEMED"
}

export const redeemInvitation = createMachine<RedeemInvitationContext, RedeemInvitationEvent>({
    initial: "success",
    context: {
        profileId: null,
        email: null,
        acceptedToSVersion: null,
        subscribedToNewsletter: null
    },
    states: {
        success: {
            type: "final",
            entry: sendParent({type: "REDEEMED"})
        }
    }
}, {
    services: {}
});