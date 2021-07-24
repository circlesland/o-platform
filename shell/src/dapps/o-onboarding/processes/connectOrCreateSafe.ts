import {createMachine, send, sendParent} from "xstate";
import {BN} from "ethereumjs-util";
import {Origin} from "./init";

export type ConnectOrCreateSafeContext = {
    privateKey: string;
    address: string;
    origin: Origin;
    balance?: BN;
}

export type ConnectOrCreateSafeEvent = {
    type: "CANCEL"
} | {
    type: "CANCELLED"
} | {
    type: "SUBMIT"
} | {
    type: "SAFE_CREATED"
} | {
    type: "SAFE_CONNECTED"
}

export const connectOrCreateSafe = createMachine<ConnectOrCreateSafeContext, ConnectOrCreateSafeEvent>({
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
            entry: [sendParent({type: "SAFE_CONNECTED"}), sendParent({type: "SAFE_CREATED"})]
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