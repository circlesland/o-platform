import {assign, createMachine, send, spawn} from "xstate";
import {actions} from "xstate";
import {getSessionInfo, SessionInfo} from "../../o-passport/processes/identify/services/getSessionInfo";
import {BN} from "ethereumjs-util";
import {loadProfile} from "../../o-passport/processes/identify/services/loadProfile";
import {loginMachine} from "./login";
import {registerMachine} from "./register";
import {getInvitedMachine} from "./getInvited";
import {createProfileMachine} from "./createProfile";
import {connectOrCreateEoa} from "./connectOrCreateEoa";
import {redeemInvitation} from "./redeemInvitation";
import {fundSafeFromEoa} from "./fundSafeFromEoa";
import {connectOrCreateSafe} from "./connectOrCreateSafe";
import {
    ClaimedInvitationDocument,
    InvitationTransactionDocument,
    SafeFundingTransactionDocument,
    WhoamiDocument
} from "../../../shared/api/data/types";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {upsertIdentity} from "../../o-passport/processes/upsertIdentity";
import {upsertRegistration} from "./registration/promptRegistration";
import {acquireSession} from "../../o-passport/processes/identify/aquireSession/acquireSession";
import {promptConnectOrCreate} from "./connectOrCreate/promptConnectOrCreate";
import {promptRedeemInvitation} from "./invitation/promptRedeemInvitation";
import {promptGetInvited} from "./invitation/promptGetInvited";

export type Origin = "Created" | "Imported";

export type RegistrationData = {
    profileId: number;
    email: string;
    acceptedToSVersion: string;
    subscribedToNewsletter: boolean;
}

export type InvitationData = {
    id: string
    createdByProfileId: number
    createdAt: string,
    redeemedAt?: string,
    redeemedTo?: string
}

export type InvitationTransaction = {
    txHash: string
    value: BN
}

export type ProfileData = {
    id: number;
    firstName: string;
    lastName?: string;
    cityId: number;
    passion?: string;
    avatarUrl?: string;
    circlesSafeOwner?: string;
}

export type EoaData = {
    privateKey: string;
    address: string;
    origin: Origin;
    balance: BN;
}

export type SafeData = {
    address: string;
    origin: Origin;
    balance?: BN;
}

export type UbiData = {
    tokenAddress: string;
}

export type InitContext = {
    session?: SessionInfo;
    _login: any;

    registration?: RegistrationData;
    _register: any;

    invitation?: InvitationData;
    _invitation:any;

    profile?: ProfileData;
    _profile: any;

    eoa?: EoaData;
    _eoa: any;
    _redeemInvitation: any;
    eoaInvitationTransaction?: InvitationTransaction;

    safe?: SafeData;
    _safe: any;
    _fundSafeFromEoa:any;
    safeInvitationTransaction?: InvitationTransaction;

    ubi?: UbiData
    _ubi: any;
};

export type InitEvent = {
    type: "CANCEL"
} | {
    type: "NO_SESSION"
} | {
    type: "GOT_SESSION",
    session: SessionInfo
} | {
    type: "NO_REGISTRATION"
} | {
    type: "GOT_REGISTRATION",
    registration: RegistrationData
} | {
    type: "NO_INVITATION"
} | {
    type: "GOT_INVITATION",
    invitation: InvitationData
} | {
    type: "NO_PROFILE"
} | {
    type: "GOT_PROFILE",
    profile: ProfileData
} | {
    type: "NO_EOA"
} | {
    type: "GOT_EOA",
    eoa: EoaData
} | {
    type: "NOT_REDEEMED"
}| {
    type: "GOT_REDEEMED",
    transaction: InvitationTransaction
} | {
    type: "NO_SAFE"
} | {
    type: "GOT_SAFE",
    safe: SafeData
} | {
    type: "SAFE_NOT_FUNDED"
} | {
    type: "GOT_SAFE_FUNDED",
    transaction: InvitationTransaction
}| {
    type: "NO_UBI"
}| {
    type: "GOT_UBI",
    ubi: UbiData
} | {
    type: "LOGGED_IN"
} | {
    type: "CANCELLED"
} | {
    type: "REGISTERED"
} | {
    type: "GOT_INVITED"
} | {
    type: "PROFILE_CREATED"
} | {
    type: "INVITATION_USED"
} | {
    type: "INVITATION_UNUSED"
} | {
    type: "EOA_CREATED"
} | {
    type: "EOA_CONNECTED"
} | {
    type: "REDEEMED"
} | {
    type: "SAFE_CONNECTED"
} | {
    type: "SAFE_CREATED"
} | {
    type: "FUNDED"
} | {
    type: "REGISTRATION_ERROR",
    error: Error
} | {
    type: "INVITATION_ERROR",
    error: Error
} | {
    type: "PROFILE_ERROR",
    error: Error
} | {
    type: "EOA_ERROR",
    error: Error
} | {
    type: "SAFE_ERROR",
    error: Error
}

export const initMachine = createMachine<InitContext, InitEvent>({
    id: `init`,
    initial: "initial",
    context: {
        session: null,
        _login: null,

        registration: null,
        _register: null,

        invitation: null,
        _invitation: null,

        profile: null,
        _profile: null,

        eoa: null,
        _eoa: null,
        _redeemInvitation: null,
        eoaInvitationTransaction: null,

        safe: null,
        _safe: null,
        _fundSafeFromEoa: null,
        safeInvitationTransaction: null,

        ubi: null,
        _ubi: null
    },
    on: {
        CANCEL: "cancelled"
    },
    states: {
        initial: {
            invoke: {src: "loadSession"},
            on: {
                NO_SESSION: {
                    actions: [
                        () => window.o.runProcess(acquireSession, {
                            successAction: (data) => {
                                (<any>window).runInitMachine();
                            }
                        }),
                        /*assign({
                            _register: () => spawn(loginMachine)
                        })*/
                    ]
                },
                LOGGED_IN: {
                    actions: actions.stop(ctx => ctx._login),
                    target: "initial"
                },
                CANCELLED: {
                    actions: [
                        actions.stop(ctx => ctx._login),
                        send({type: "CANCEL"})
                    ]
                },
                GOT_SESSION: {
                    actions: "assignSessionInfoToContext",
                    target: "register"
                }
            }
        },
        register: {
            invoke: {src: "loadRegistration"},
            on: {
                NO_REGISTRATION: {
                    actions: [
                        () => window.o.runProcess(upsertRegistration, {
                            successAction: (data) => {
                                (<any>window).runInitMachine();
                            }
                        }),
                        /*assign({
                            _register: () => spawn(registerMachine)
                        })*/
                    ]
                },
                REGISTERED: {
                    actions: actions.stop(ctx => ctx._register),
                    target: "register"
                },
                CANCELLED: {
                    actions: [
                        actions.stop(ctx => ctx._register),
                        send({type: "CANCEL"})
                    ],
                },
                REGISTRATION_ERROR: {
                    actions: [
                        (ctx, event) => {
                            console.error(event);
                            throw event.error;
                        },
                        actions.stop(ctx => ctx._register),
                        send({type: "CANCEL"})
                    ]
                },
                GOT_REGISTRATION: {
                    actions: "assignRegistrationToContext",
                    target: "invitation"
                }
            }
        },
        invitation: {
            invoke: {src: "loadClaimedInvitation"},
            on: {
                NO_INVITATION: {
                  actions: [
                    /*assign({
                      _invitation: () => spawn(getInvitedMachine)
                    }),*/
                    () => {
                      window.o.runProcess(promptGetInvited, {
                        successAction: () => (<any>window).runInitMachine()
                      });
                    }
                  ]
                },
                GOT_INVITED: {
                    actions: actions.stop(ctx => ctx._invitation),
                    target: "invitation"
                },
                INVITATION_ERROR: {
                    actions: [
                        (ctx, event) => {
                            console.error(event);
                            throw event.error;
                        },
                        actions.stop(ctx => ctx._invitation),
                        send({type: "CANCEL"})
                    ]
                },
                GOT_INVITATION: {
                    actions: "assignInvitationToContext",
                    target: "profile"
                }
            }
        },
        profile: {
            invoke: {src: "loadProfile"},
            on: {
                NO_PROFILE: {
                    actions: [
                        (context) => window.o.runProcess(upsertIdentity, {
                            id: context.registration.profileId,
                            successAction: (data) => {
                                (<any>window).runInitMachine();
                            }
                        }),
                        /*assign({
                            _register: () => spawn(createProfileMachine)
                        })*/
                    ]
                },
                CANCELLED: {
                    actions: [
                        actions.stop(ctx => ctx._profile),
                        send({type: "CANCEL"})
                    ]
                },
                PROFILE_CREATED: {
                    actions: actions.stop(ctx => ctx._profile),
                    target: "profile"
                },
                GOT_PROFILE: {
                    actions: "assignProfileToContext",
                    target: "eoa"
                }
            }
        },
        eoa: {
            initial: "load",
            states: {
                load: {
                    invoke: {src: "loadEoa"},
                    on: {
                        NO_EOA: {
                            target: "connectOrCreate"
                        },
                        GOT_EOA: {
                            actions: "assignEoaToContext",
                            target: "checkInvitation"
                        }
                    }
                },
                connectOrCreate: {
                    entry: [
                        /*assign({
                            _eoa: () => spawn(connectOrCreateEoa)
                        }),*/
                        () => {
                            window.o.runProcess(promptConnectOrCreate, {});
                        }
                    ],
                    on: {
                        CANCELLED: {
                            actions: [
                                actions.stop(ctx => ctx._eoa),
                                send({type: "CANCEL"})
                            ]
                        },
                        EOA_CONNECTED: {
                            actions: actions.stop(ctx => ctx._eoa),
                            target: "load"
                        },
                        EOA_CREATED: {
                            actions: actions.stop(ctx => ctx._eoa),
                            target: "load"
                        }
                    }
                },
                checkInvitation: {
                    invoke: { src: "loadEoaInvitationTransaction" },
                    on: {
                        NOT_REDEEMED: {
                            target: "redeemInvitation"
                        },
                        GOT_REDEEMED: {
                            actions: "assignEoaInvitationTransactionToContext",
                            target: "eoaReady"
                        }
                    }
                },
                redeemInvitation: {
                    entry: [
                      /*assign({
                        _redeemInvitation: () => spawn(redeemInvitation)
                      }),*/
                      () => {
                          window.o.runProcess(promptRedeemInvitation, {

                          });
                      }
                    ],
                    on: {
                        REDEEMED: {
                            actions: actions.stop(ctx => ctx._redeemInvitation),
                            target: "load"
                        },
                        CANCELLED: {
                            actions: [
                                actions.stop(ctx => ctx._redeemInvitation),
                                send({type: "CANCEL"})
                            ]
                        }
                    }
                },
                eoaReady: {
                    type: "final"
                }
            },
            onDone: "safe"
        },
        safe: {
            initial: "load",
            states: {
                load: {
                    invoke: {src: "loadSafe"},
                    on: {
                        NO_SAFE: {
                            target: "connectOrCreate"
                        },
                        GOT_SAFE: {
                            actions: "assignSafeToContext",
                            target: "checkInvitation"
                        }
                    }
                },
                connectOrCreate: {
                    entry: assign({
                        _safe: () => spawn(connectOrCreateSafe)
                    }),
                    on: {
                        CANCELLED: {
                            actions: send({type: "CANCEL"})
                        },
                        SAFE_CONNECTED: {
                            target: "load"
                        },
                        SAFE_CREATED: {
                            target: "load"
                        }
                    }
                },
                checkInvitation: {
                    invoke: {src: "loadSafeInvitationTransaction"},
                    on: {
                        SAFE_NOT_FUNDED: {
                            target: "fundSafeFromEoa"
                        },
                        GOT_SAFE_FUNDED: {
                            actions: "assignSafeInvitationTransactionToContext",
                            target: "safeReady"
                        }
                    }
                },
                fundSafeFromEoa: {
                    entry: assign({
                        _fundSafeFromEoa: () => spawn(fundSafeFromEoa)
                    }),
                    on: {
                        FUNDED: {
                            target: "load"
                        },
                        CANCELLED: {
                            actions: send({type: "CANCEL"})
                        }
                    }
                },
                safeReady: {
                    type: "final"
                }
            },
            onDone: "ubi"
        },
        ubi: {
            invoke: {src:"loadUbi"},
            on: {
                NO_UBI: {
                    actions: ["signupForUbi", send({ type: "CANCEL" })],
                },
                GOT_UBI: {
                    actions: "assignUbiToContext",
                    target: "success"
                }
            }
        },
        cancelled: {
            type: "final"
        },
        success: {
            type: "final"
        }
    }
}, {
    services: {
        loadSession: () => (callback) => {
            getSessionInfo()
                .then(sessionInfo => {
                    if (sessionInfo.isLoggedOn) {
                        callback(<any>{type: "GOT_SESSION", session: sessionInfo});
                    } else {
                        callback({type: "NO_SESSION"});
                    }
                })
                .catch(e => {
                    console.warn(`Couldn't determine the session state -> Assuming "NO_SESSION".`, e);
                    callback({type: "NO_SESSION"});
                });
        },
        loadRegistration: (ctx) => (callback) => {
            if (!ctx.session) throw new Error(`ctx.session is not set`);

            if (!ctx.session.profileId) {
                callback({type: "NO_REGISTRATION"});
                return;
            }

            let email:string;

            window.o.apiClient.client.subscribeToResult()
                .then(apiClient => {
                    return apiClient.query({
                        query: WhoamiDocument,
                    })
                })
                .then(result => {
                    if (result.errors) {
                        callback({type: "REGISTRATION_ERROR", error: new Error(`Couldn't load the registration for the following reason: ${JSON.stringify(result.errors)}`)});
                    } else {
                        email = result.data.whoami;
                        return loadProfile(ctx.session.profileId)
                    }
                })
                .then(profile => {
                    callback({
                        type: "GOT_REGISTRATION",
                        registration: {
                            email: email,
                            profileId: profile.id,
                            acceptedToSVersion: "", // TODO: Important in the context?
                            subscribedToNewsletter: profile.newsletter
                        }
                    });
                })
                .catch(e => {
                    callback({type: "REGISTRATION_ERROR", error: e});
                });
        },
        loadClaimedInvitation: (ctx) => (callback) => {
            if (!ctx.registration) throw new Error(`ctx.registration is not set`);

            /*callback({type: "NO_INVITATION"});
            return;*/

            window.o.apiClient.client.subscribeToResult()
                .then(apiClient => {
                    return apiClient.query({
                        query: ClaimedInvitationDocument
                    })
                })
                .then(result => {
                    if (result.errors) {
                        callback({
                            type: "INVITATION_ERROR",
                            error: new Error(`Couldn't load the registration for the following reason: ${JSON.stringify(result.errors)}`)
                        });
                        return;
                    }
                    if (!result.data.claimedInvitation) {
                        callback({type: "NO_INVITATION"});
                        return;
                    }

                    // TODO: Why is the any cast necessary for the "GOT_INVITATION" event?
                    // callback({type: "NO_INVITATION"});
                    callback(<InitEvent>{ type: "GOT_INVITATION", invitation: result.data.claimedInvitation });
                })
                .catch(e => {
                    callback({
                        type: "INVITATION_ERROR",
                        error: e
                    });
                });
        },
        loadProfile: (ctx) => (callback) => {
            if (!ctx.invitation) throw new Error(`ctx.invitation is not set`);

            loadProfile()
                .then(profile => {
                    if (profile.firstName.trim() !== "") {
                        callback({
                            type: "GOT_PROFILE",
                            profile: {
                                id: profile.id,
                                avatarUrl: profile.avatarUrl,
                                lastName: profile.lastName,
                                firstName: profile.firstName,
                                cityId: profile.cityGeonameid,
                                passion: profile.dream,
                                circlesSafeOwner: profile.circlesSafeOwner
                            }
                        })
                    } else {
                        callback({type: "NO_PROFILE"});
                    }
                })
                .catch(e => {
                    callback({type: "PROFILE_ERROR", error: e});
                });
        },
        loadEoa: (ctx) => (callback) => {
            if (!ctx.profile) throw new Error(`ctx.profile is not set`);

            const key = sessionStorage.getItem("circlesKey");
            if (!key || !ctx.profile.circlesSafeOwner) {
                callback({type: "NO_EOA"});
                return;
            }
            try {
                const eoa = RpcGateway.get().eth.accounts.privateKeyToAccount(key);
                if (!eoa) {
                    callback({type: "EOA_ERROR", error: new Error(`Couldn't derive the EOA address from the stored private key.`)});
                    return;
                }
                RpcGateway.get().eth.getBalance(eoa.address).then(balance => {
                    callback({type: "GOT_EOA", eoa: {
                            address: eoa.address,
                            privateKey: key,
                            origin: "Created",
                            balance: new BN(balance)
                        }});
                }).catch(e => {
                    callback({type: "EOA_ERROR", error: e});
                })
            } catch (e) {
                callback({type: "EOA_ERROR", error: e});
            }
        },
        loadEoaInvitationTransaction: (ctx) => (callback) => {
            if (!ctx.eoa) throw new Error(`ctx.eoa is not set`);

            window.o.apiClient.client.subscribeToResult().then(apiClient => {
                return apiClient.query({
                    query: InvitationTransactionDocument
                });
            })
            .then(result => {
                // TODO: Find the transaction from the "invitation EOA" to the user's EOA (must be the only outgoing transaction from the invite-eoa)
                if (result.errors || !result.data.transaction) {
                    callback({type: "NOT_REDEEMED"});
                } else {
                    callback({type: "GOT_REDEEMED", transaction: result.data.transaction});
                }
            })
        },
        loadSafe: (ctx) => (callback) => {
            loadProfile().then(result => {
                if (!result.circlesAddress){
                    callback({type: "NO_SAFE"});
                } else {
                    // TODO: Check if the safe is owned by the previously queried EOA.
                    RpcGateway.get().eth.getBalance(result.circlesAddress).then(balance => {
                        callback({
                            type: "GOT_SAFE", safe: {
                                address: result.circlesAddress,
                                origin: "Created", // TODO: Find correct origin,
                                balance: new BN(balance)
                            }
                        });
                    })
                    .catch(error => {
                        callback({
                            type: "SAFE_ERROR",
                            error: error
                        })
                    });
                }
            })
            .catch(error => {
                callback({
                    type: "SAFE_ERROR",
                    error: error
                })
            })
        },
        loadSafeInvitationTransaction: (ctx) => (callback) => {
            if (!ctx.safe) throw new Error(`ctx.safe is not set`);

            window.o.apiClient.client.subscribeToResult().then(apiClient => {
                return apiClient.query({
                    query: SafeFundingTransactionDocument
                });
            })
            .then(result => {
                // TODO: Find the invitation transaction from the user's EOA to the safe (use IndexedTransactions from the API.)
                if(result.errors || !result.data) {
                    send({type: "SAFE_NOT_FUNDED"});
                } else {
                    send({type: "GOT_SAFE_FUNDED", transaction: result.data.transaction});
                }
            });
        },
        loadUbi: async (ctx) => {
            if (!ctx.safe) throw new Error(`ctx.safe is not set`);

            // TODO: Check if the user's safe is already signed up at the UBI hub
            send({type: "NO_UBI"});
            // send({type: "GOT_UBI"});
        },
        validateInvitation: async (context, event) => {
            send({type: "INVITATION_USED"});
            // send({type: "INVITATION_UNUSED"});
        }
    },
    actions: {
        assignSessionInfoToContext: assign( {
            session: (ctx, event) => {
                return event.type == "GOT_SESSION" ? event.session : undefined
            }
        }),
        assignRegistrationToContext: assign( {
            registration: (ctx, event) => {
                return event.type == "GOT_REGISTRATION" ? event.registration : undefined
            }
        }),
        assignInvitationToContext: assign( {
            invitation: (ctx, event) => {
                return event.type == "GOT_INVITATION" ? event.invitation : undefined
            }
        }),
        assignProfileToContext: assign( {
            profile: (ctx, event) => {
                return event.type == "GOT_PROFILE" ? event.profile : undefined
            }
        }),
        assignEoaToContext: assign( {
            eoa: (ctx, event) => {
                return event.type == "GOT_EOA" ? event.eoa : undefined
            }
        }),
        assignSafeToContext: assign( {
            safe: (ctx, event) => {
                return event.type == "GOT_SAFE" ? event.safe : undefined
            }
        }),
        assignEoaInvitationTransactionToContext: assign( {
            eoaInvitationTransaction: (ctx, event) => {
                return event.type == "GOT_REDEEMED" ? event.transaction : undefined
            }
        }),
        assignSafeInvitationTransactionToContext: assign( {
            safeInvitationTransaction: (ctx, event) => {
                return event.type == "GOT_SAFE_FUNDED" ? event.transaction : undefined
            }
        }),
        fundSafeFromEoa: () => {
            // TODO: Transfer the invitation amount minus 0.02 xDai from the user's EOA to the safe
            //       and index the transaction.
        },
        signupForUbi: () => {
        },
        assignUbiToContext: assign( {
            ubi: (ctx, event) => event.type == "GOT_UBI" ? event.ubi : undefined
        })
    }
});