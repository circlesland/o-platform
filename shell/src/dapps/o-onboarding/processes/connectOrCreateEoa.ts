import {createMachine, send, sendParent} from "xstate";
import {BN} from "ethereumjs-util";
import {Origin} from "./init";

export type ConnectOrCreateEoaContext = {
    privateKey: string;
    address: string;
    origin: Origin;
    balance: BN;
}

export type ConnectOrCreateEoaEvent = {
    type: "CANCEL"
} | {
    type: "CANCELLED"
} | {
    type: "SUBMIT"
} | {
    type: "EOA_CREATED"
} | {
    type: "EOA_CONNECTED"
}

export const connectOrCreateEoa = createMachine<ConnectOrCreateEoaContext, ConnectOrCreateEoaEvent>({
    initial: "firstName",
    context: {
        privateKey: null,
        address: null,
        origin: null,
        balance: null
    },
    on: {
        CANCEL: {
            target: "cancelled"
        }
    },
    states: {
        decision: {
            invoke: {src: "promptConnectOrCreate"},
            on: {
                SUBMIT: {
                    actions: "assignConnectOrCreateToContext",
                    target: "lastName"
                }
            }
        },
        create: {
            initial: "generatePrivateKey",
            states: {
                generatePrivateKey: {
                    invoke: {
                        src: "generatePrivateKey"
                    }
                }
            }
        },
        connect: {
            initial: "",
            states: {
            }
        },
        cancelled: {
            type: "final",
            entry: sendParent({type: "CANCELLED"})
        },
        success: {
            type: "final",
            entry: [sendParent({type: "EOA_CONNECTED"}), sendParent({type: "EOA_CREATED"})]
        }
    }
}, {
    services: {
        promptConnectOrCreate: async (context, event) => {},
        generatePrivateKey: async (context, event) => {}
    },
    actions: {
        assignConnectOrCreateToContext: (context, event) => {}
    }
});