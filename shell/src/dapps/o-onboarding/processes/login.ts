import {createMachine, send, sendParent} from "xstate";
import {LoginWithEmailDocument, VerifyDocument} from "../../o-passport/data/auth/types";
import {ExchangeTokenDocument, SessionInfoDocument} from "../../o-passport/data/api/types";

export type LoginContext = {
    appId: string;
    email: string;
    acceptedTosVersion: string;
    code: string;
}

export type LoginEvent = {
    type: "CANCEL"
} | {
    type: "AUTH_CODE_SENT"
} | {
    type: "AUTH_CODE_FAILED"
}| {
    type: "SUBMIT"
    value: any
}| {
    type: "EXCHANGED_CODE_FOR_TOKEN"
    token: string
}| {
    type: "EXCHANGED_CODE_FOR_TOKEN_FAILED"
}| {
    type: "EXCHANGED_TOKEN_FOR_SESSION"
}

export const loginMachine = createMachine<LoginContext, LoginEvent>({
    id: `login`,
    initial: "email",
    context: {
        email: null,
        appId: null,
        acceptedTosVersion: null,
        code: null
    },
    on: {
        CANCEL: {
            target: "cancelled"
        }
    },
    states: {
        email: {
            invoke: {src: "promptEmail"},
            on: {
                SUBMIT: {
                    actions: "assignEmailToContext",
                    target: "tos"
                }
            }
        },
        tos: {
            invoke: {src: "promptToS"},
            on: {
                SUBMIT: {
                    actions: "assignToSToContext",
                    target: "login"
                }
            }
        },
        login: {
            initial: "requestAuthCode",
            states: {
                requestAuthCode: {
                    invoke: {src: "sendAuthCode"},
                    on: {
                        AUTH_CODE_SENT: {
                            actions: ["memorizeAuthCodeSent"],
                            target: "verifyAuthCode"
                        },
                        AUTH_CODE_FAILED: {
                            actions: send({type: "CANCEL"})
                        }
                    }
                },
                verifyAuthCode: {
                    invoke: {src: "promptAuthCode"},
                    on: {
                        SUBMIT: {
                            actions: "assignAuthCodeToContext",
                            target: "exchangeCodeForToken"
                        }
                    }
                },
                exchangeCodeForToken: {
                    invoke: {src: "exchangeCodeForToken"},
                    on: {
                        EXCHANGED_CODE_FOR_TOKEN: {
                            actions: "assignTokenToContext",
                            target: "exchangeTokenForSession"
                        },
                        EXCHANGED_CODE_FOR_TOKEN_FAILED: {
                            actions: send({type: "CANCEL"})
                        }
                    }
                },
                exchangeTokenForSession: {
                    invoke: {src: "exchangeTokenForSession"},
                    on: {
                        EXCHANGED_TOKEN_FOR_SESSION: {
                            target: "loggedIn"
                        }
                    }
                },
                loggedIn: {
                    type: "final"
                }
            },
            onDone: {
                target: "success"
            }
        },
        cancelled: {
            type: "final",
            entry: sendParent({
                type: "CANCELLED"
            })
        },
        success: {
            type: "final",
            entry: sendParent({
                type: "LOGGED_IN"
            })
        },
    }
}, {
    services: {
        promptEmail: async (context, event) => {
            send({type: "SUBMIT", value: "email"});
        },
        promptToS: async (context, event) => {
            send({type: "SUBMIT", value: "email"});
        },
        promptAuthCode: async (context, event) => {
            send({type: "SUBMIT", value: "email"});
        },
        sendAuthCode: async (context, event) => {
            const authClient = await window.o.authClient.client.subscribeToResult();
            const result = await authClient.mutate({
                mutation: LoginWithEmailDocument,
                variables: {
                    appId: context.appId,
                    emailAddress: context.email,
                    acceptTosVersion: context.acceptedTosVersion,
                },
            });

            send(result.data?.loginWithEmail?.success
                ? {type: "AUTH_CODE_SENT"}
                : {type: "AUTH_CODE_FAILED"});
        },
        exchangeCodeForToken: async (context) => {
            const authClient = await window.o.authClient.client.subscribeToResult();
            const result = await authClient.mutate({
                mutation: VerifyDocument,
                variables: {
                    oneTimeToken: context.code.trim(),
                },
            });
            send(result.data?.verify?.success
                ? {type: "EXCHANGED_CODE_FOR_TOKEN", token: result.data.verify.token}
                : {type: "EXCHANGED_CODE_FOR_TOKEN_FAILED"});
        },
        exchangeTokenForSession: async (context, event) => {
            if (event.type !== "EXCHANGED_CODE_FOR_TOKEN"){
                send({type: "CANCEL"});
                return;
            }
            const client = await window.o.apiClient.client.subscribeToResult();
            const exchangeResult = await client.mutate({
                mutation: ExchangeTokenDocument,
                context: {
                    headers: {
                        "Authorization": event.token
                    }
                }
            });
            if (exchangeResult.errors && exchangeResult.errors.length > 0) {
                exchangeResult.errors.forEach(o => console.error(o));
                send({type: "CANCEL"});
                return;
            }
            if (!exchangeResult.data?.exchangeToken?.success) {
                send({type: "CANCEL"});
                return;
            }
            send({type: "EXCHANGED_TOKEN_FOR_SESSION"});
        }
    },
    actions: {
        memorizeAuthCodeSent: (context, event) => {},
        assignEmailToContext: (context, event) => {},
        assignToSToContext: (context, event) => {},
        assignTokenToContext: (context, event) => {},
        assignNewsletterToContext: (context, event) => {}
    }
});