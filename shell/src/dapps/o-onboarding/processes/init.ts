import {assign, createMachine, send, spawn} from "xstate";
import {getSessionInfo, SessionInfo} from "../../o-passport/processes/identify/services/getSessionInfo";
import {BN} from "ethereumjs-util";
import {loadProfile} from "../../o-passport/processes/identify/services/loadProfile";
import {WhoamiDocument} from "../../o-passport/data/api/types";
import {loginMachine} from "./login";
import {registerMachine} from "./register";
import {getInvitedMachine} from "./getInvited";
import {createProfileMachine} from "./createProfile";
import {connectOrCreateEoa} from "./connectOrCreateEoa";
import {redeemInvitation} from "./redeemInvitation";
import {fundSafeFromEoa} from "./fundSafeFromEoa";
import {connectOrCreateSafe} from "./connectOrCreateSafe";

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
                    actions: assign({
                        _login: () => spawn(loginMachine)
                    })
                },
                LOGGED_IN: {
                    target: "initial"
                },
                CANCELLED: {
                    actions: send({type: "CANCEL"})
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
                    actions: assign({
                        _register: () => spawn(registerMachine)
                    })
                },
                REGISTERED: {
                    target: "register"
                },
                CANCELLED: {
                    actions: send({type: "CANCEL"})
                },
                GOT_REGISTRATION: {
                    actions: "assignRegistrationToContext",
                    target: "invitation"
                }
            }
        },
        invitation: {
            invoke: {src: "loadInvitation"},
            on: {
                NO_INVITATION: {
                    actions: assign({
                        _invitation: () => spawn(getInvitedMachine)
                    })
                },
                GOT_INVITED: {
                    target: "invitation"
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
                    actions: assign({
                        _profile: () => spawn(createProfileMachine)
                    })
                },
                CANCELLED: {
                    actions: send({type: "CANCEL"})
                },
                PROFILE_CREATED: {
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
                    entry: assign({
                        _eoa: () => spawn(connectOrCreateEoa)
                    }),
                    on: {
                        CANCELLED: {
                            actions: send({type: "CANCEL"})
                        },
                        EOA_CONNECTED: {
                            target: "load"
                        },
                        EOA_CREATED: {
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
                    entry: assign({
                        _redeemInvitation: () => spawn(redeemInvitation)
                    }),
                    on: {
                        REDEEMED: {
                            target: "load"
                        },
                        CANCELLED: {
                            actions: send({type: "CANCEL"})
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
        loadSession: async () => {
            try {
                const sessionInfo = await getSessionInfo();
                if (sessionInfo.isLoggedOn) {
                    send({type: "GOT_SESSION", session: sessionInfo});
                    return;
                }
            } catch (e) {
                console.warn(`Couldn't determine the session state -> Assuming "NO_SESSION".`, e);
            }
            send({type: "NO_SESSION"});
        },
        loadRegistration: async (ctx) => {
            if (!ctx.session) throw new Error(`ctx.session is not set`);

            if (!ctx.session.profileId) {
                send({type: "NO_REGISTRATION"});
                return;
            }

            const apiClient = await window.o.apiClient.client.subscribeToResult();
            const result = await apiClient.query({
                query: WhoamiDocument,
            });
            if (result.errors) {
                return;
            }

            const email = result.data.whoami;
            const profile = await loadProfile(ctx.session.profileId);

            send({
                type: "GOT_REGISTRATION",
                registration: {
                    email: email,
                    profileId: profile.id,
                    acceptedToSVersion: "", // TODO: Important in the context?
                    subscribedToNewsletter: profile.newsletter
                }
            });
        },
        loadInvitation: async (ctx) => {
            if (!ctx.registration) throw new Error(`ctx.registration is not set`);

            send({type: "NO_INVITATION"});
            // send({type: "GOT_INVITATION"});
        },
        loadProfile: async (ctx) => {
            if (!ctx.invitation) throw new Error(`ctx.invitation is not set`);

            send({type: "NO_PROFILE"});
            // send({type: "GOT_PROFILE"});
        },
        loadEoa: async (ctx) => {
            if (!ctx.profile) throw new Error(`ctx.profile is not set`);

            send({type: "NO_EOA"});
            // send({type: "GOT_EOA"});
        },
        loadEoaInvitationTransaction: async (ctx) => {
            if (!ctx.eoa) throw new Error(`ctx.eoa is not set`);

            // TODO: Find the transaction from the "invitation EOA" to the user's EOA (must be the only outgoing transaction from the invite-eoa)
            // send({type: "GOT_REDEEMED"});
            send({type: "NOT_REDEEMED"});
        },
        loadSafeInvitationTransaction: async (ctx) => {
            if (!ctx.safe) throw new Error(`ctx.safe is not set`);
            // TODO: Find the invitation transaction from the user's EOA to the safe (use IndexedTransactions from the API.)
            // send({type: "GOT_SAFE_FUNDED"});
            send({type: "SAFE_NOT_FUNDED"});
        },
        loadUbi: async (ctx) => {
            if (!ctx.safe) throw new Error(`ctx.safe is not set`);

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
            session: (ctx, event) => event.type == "GOT_SESSION" ? event.session : undefined
        }),
        assignRegistrationToContext: assign( {
            registration: (ctx, event) => event.type == "GOT_REGISTRATION" ? event.registration : undefined
        }),
        assignProfileToContext: assign( {
            profile: (ctx, event) => event.type == "GOT_PROFILE" ? event.profile : undefined
        }),
        assignEoaToContext: assign( {
            eoa: (ctx, event) => event.type == "GOT_EOA" ? event.eoa : undefined
        }),
        assignSafeToContext: assign( {
            safe: (ctx, event) => event.type == "GOT_SAFE" ? event.safe : undefined
        }),
        assignEoaInvitationTransactionToContext: assign( {
            eoaInvitationTransaction: (ctx, event) => event.type == "GOT_REDEEMED" ? event.transaction : undefined
        }),
        assignSafeInvitationTransactionToContext: assign( {
            safeInvitationTransaction: (ctx, event) => event.type == "GOT_SAFE_FUNDED" ? event.transaction : undefined
        }),
        fundSafeFromEoa: () => {
            // TODO: Transfer the invitation amount minus 0.02 xDai from the user's EOA to the safe
            //       and index the transaction.
        },
        signupForUbi: () => {
        },
        assignUbiToContext: assign( {
            ubi: (ctx, event) => event.type == "GOT_UBI" ? event.ubi : undefined
        }),
    }
});