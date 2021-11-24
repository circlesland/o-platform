import { assign, createMachine, send } from "xstate";
import { getSessionInfo } from "../../o-passport/processes/identify/services/getSessionInfo";
import { BN } from "ethereumjs-util";
import { loadProfile } from "../../o-passport/processes/identify/services/loadProfile";
import {
  ClaimedInvitationDocument,
  HubSignupTransactionDocument,
  InitAggregateStateDocument,
  InvitationTransactionDocument,
  SafeFundingTransactionDocument,
  WhoamiDocument,
} from "../../../shared/api/data/types";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { upsertIdentity } from "../../o-passport/processes/upsertIdentity";
import { upsertRegistration } from "./registration/promptRegistration";
import { promptConnectOrCreate } from "./connectOrCreate/promptConnectOrCreate";
import { promptRedeemInvitation } from "./invitation/promptRedeemInvitation";
import { promptGetInvited } from "./invitation/promptGetInvited";
import { acquireSession } from "../../o-passport/processes/identify/aquireSession/acquireSession2";
import { fundSafeFromEoa } from "./fundSafeFromEoa/fundSafeFromEoa";
import { CirclesHub } from "@o-platform/o-circles/dist/circles/circlesHub";
import { HUB_ADDRESS } from "@o-platform/o-circles/dist/consts";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { KeyManager } from "../../o-passport/data/keyManager";
import { unlockKey } from "./unlockKey/unlockKey";
import { InitEvent, UbiData } from "./initEvent";
import { InitContext } from "./initContext";
import { push } from "svelte-spa-router";

export const initMachine = createMachine<InitContext, InitEvent>(
  {
    id: `init`,
    initial: "initial",
    context: {
      session: null,
      registration: null,
      invitation: null,
      profile: null,
      eoa: null,
      eoaInvitationTransaction: null,
      safe: null,
      safeInvitationTransaction: null,
      ubi: null,
    },
    on: {
      CANCEL: "cancelled",
    },
    states: {
      initial: {
        entry: [() => console.log("init.initial")],
        invoke: { src: "loadSession" },
        on: {
          NO_SESSION: {
            actions: "acquireSessionAndRestart",
          },
          GOT_SESSION: {
            actions: "assignSessionInfoToContext",
            target: "register",
            // target: "checkAggregateState"
          },
        },
      },
      /*
    checkAggregateState: {
      invoke: {
        src: "loadInitAggregateState",
        onDone: [{
          cond: (context) => !!context.initAggregateState.hubSignupTransaction,
          actions: () => console.log("init.checkAggregateState.onDone: Got 'initAggregateState.hubSignupTransaction'. Going directly to 'success'."),
          target: "success"
        }, {
          cond: (context) => !!context.initAggregateState.safeFundingTransaction,
          actions: () => console.log("init.checkAggregateState.onDone: Got 'initAggregateState.safeFundingTransaction'. Going directly to 'signupForUbi'."),
          target: "signupForUbi"
        }, {
          cond: (context) => !!context.initAggregateState.invitationTransaction && !context.initAggregateState.registration?.circlesAddress,
          actions: () => console.log("init.checkAggregateState.onDone: Got 'initAggregateState.invitationTransaction' and no 'initAggregateState.registration.circlesAddress'. Going directly to '#connectOrCreate'."),
          target: "#connectOrCreate"
        }, {
          cond: (context) => !!context.initAggregateState.invitationTransaction && !!context.initAggregateState.registration?.circlesAddress,
          actions: () => console.log("init.checkAggregateState.onDone: Got 'initAggregateState.invitationTransaction' and 'initAggregateState.registration.circlesAddress'. Going directly to '#fundSafeFromEoa'."),
          target: "#fundSafeFromEoa"
        }, {
          cond: (context) => !!context.initAggregateState.invitation,
          actions: () => console.log("init.checkAggregateState.onDone: Got 'context.initAggregateState.invitation'. Going directly to '#'."),
          target: "#"
        }]
      }
    },*/
      register: {
        entry: () => {
          console.log("init.register");

          window.o.publishEvent({
            type: "shell.openModalProcess"
          });
        },
        invoke: { src: "loadRegistration" },
        on: {
          NO_REGISTRATION: {
            actions: [
              () => console.log("init.register.NO_REGISTRATION"),
              "upsertRegistrationAndRestart",
            ],
          },
          REGISTRATION_ERROR: {
            actions: [
              () => console.log("init.register.REGISTRATION_ERROR"),
              (ctx, event) => {
                console.error(event);
                throw event.error;
              },
              send({ type: "CANCEL" }),
            ],
          },
          GOT_REGISTRATION: {
            actions: [
              () => console.log("init.register.GOT_REGISTRATION"),
              "assignRegistrationToContext",
            ],
            target: "invitation",
          },
        },
      },
      invitation: {
        entry: () => console.log("init.invitation"),
        invoke: { src: "loadClaimedInvitation" },
        on: {
          NO_INVITATION: {
            actions: [
              () => console.log("init.invitation.NO_INVITATION"),
              "promptGetInvitedAndRestart",
            ],
          },
          INVITATION_ERROR: {
            actions: [
              () => console.log("init.invitation.INVITATION_ERROR"),
              (ctx, event) => {
                console.error(event);
                throw event.error;
              },
              send({ type: "CANCEL" }),
            ],
          },
          GOT_INVITATION: {
            actions: [
              () => console.log("init.invitation.GOT_INVITATION"),
              "assignInvitationToContext",
            ],
            target: "eoa",
          },
        },
      },
      eoa: {
        entry: () => console.log("init.eoa"),
        initial: "load",
        states: {
          load: {
            entry: () => console.log("init.eoa.load"),
            invoke: { src: "loadEoa" },
            on: {
              LOCKED_EOA: {
                actions: [() => console.log("init.eoa.load.LOCKED_EOA")],
                target: "tryUnlockEoa",
              },
              NO_EOA: {
                actions: [() => console.log("init.eoa.load.NO_EOA")],
                target: "connectOrCreate",
              },
              GOT_EOA: {
                actions: [
                  () => console.log("init.eoa.load.GOT_EOA"),
                  "assignEoaToContext",
                  () => {
                    window.o.publishEvent({
                      type: "shell.openModalProcess"
                    });
                    window.o.publishEvent(<any>{
                      type: "shell.progress",
                      message: "Starting your session .."
                    });
                  }
                ],
                target: "checkInvitation",
              },
            },
          },
          tryUnlockEoa: {
            entry: [
              () => console.log("init.eoa.tryUnlockEoa"),
              "unlockEoaAndRestart",
            ],
          },
          connectOrCreate: {
            id: "connectOrCreate",
            entry: [
              () => console.log("init.eoa.connectOrCreate"),
              "promptConnectOrCreateAndRestart",
            ],
          },
          checkInvitation: {
            entry: () => {
              console.log("init.eoa.checkInvitation");
            },
            invoke: { src: "loadEoaInvitationTransaction" },
            on: {
              NOT_REDEEMED: {
                actions: () =>
                  console.log("init.eoa.checkInvitation.NOT_REDEEMED"),
                target: "redeemInvitation",
              },
              GOT_REDEEMED: {
                actions: [
                  () => {
                    console.log("init.eoa.checkInvitation.GOT_REDEEMED");
                  },
                  "assignEoaInvitationTransactionToContext",
                ],
                target: "eoaReady",
              },
            },
          },
          redeemInvitation: {
            id: "redeemInvitation",
            entry: [
              "promptRedeemInvitationAndRestart",
              () => console.log("init.eoa.redeemInvitation"),
            ],
            on: {
              REDEEMED: {
                actions: () =>
                  console.log("init.eoa.redeemInvitation.REDEEMED"),
                target: "load",
              },
            },
          },
          eoaReady: {
            entry: [() => console.log("init.eoa.eoaReady")],
            type: "final",
          },
        },
        onDone: "safe",
      },
      safe: {
        entry: () => console.log("init.safe"),
        initial: "load",
        states: {
          load: {
            entry: () => console.log("init.safe.load"),
            invoke: { src: "loadSafe" },
            on: {
              NO_SAFE: {
                actions: () => console.log("init.safe.load.NO_SAFE"),
                target: "connectOrCreate",
              },
              GOT_SAFE: {
                actions: [
                  () => console.log("init.safe.load.GOT_SAFE"),
                  "assignSafeToContext",
                ],
                target: "checkInvitation",
              },
            },
          },
          connectOrCreate: {
            entry: [
              () => console.log("init.safe.connectOrCreate"),
              () => {
                window.o.runProcess(promptConnectOrCreate, {
                  successAction: (data) => {
                    (<any>window).runInitMachine();
                  },
                });
              },
            ],
            on: {
              SAFE_CONNECTED: {
                actions: () =>
                  console.log("init.safe.connectOrCreate.SAFE_CONNECTED"),
                target: "load",
              },
              SAFE_CREATED: {
                actions: () =>
                  console.log("init.safe.connectOrCreate.SAFE_CREATED"),
                target: "load",
              },
            },
          },
          checkInvitation: {
            entry: () => console.log("init.safe.checkInvitation"),
            invoke: { src: "loadSafeInvitationTransaction" },
            on: {
              SAFE_NOT_FUNDED: {
                actions: () =>
                  console.log("init.safe.checkInvitation.SAFE_NOT_FUNDED"),
                target: "fundSafeFromEoa",
              },
              GOT_SAFE_FUNDED: {
                actions: [
                  () =>
                    console.log("init.safe.checkInvitation.GOT_SAFE_FUNDED"),
                  "assignSafeInvitationTransactionToContext",
                ],
                target: "safeReady",
              },
            },
          },
          fundSafeFromEoa: {
            id: "fundSafeFromEoa",
            entry: [
              () => console.log("init.safe.fundSafeFromEoa"),
              "fundSafeFromEoaAndRestart",
            ],
            on: {
              FUNDED: {
                actions: () => console.log("init.safe.fundSafeFromEoa.FUNDED"),
                target: "load",
              },
            },
          },
          safeReady: {
            entry: () => console.log("init.safe.safeReady"),
            type: "final",
          },
        },
        onDone: "profile",
      },
      profile: {
        entry: () => console.log("init.profile"),
        invoke: { src: "loadProfile" },
        on: {
          NO_PROFILE: {
            actions: [
              () => console.log("init.profile.NO_PROFILE"),
              "upsertIdentityAndRestart",
            ],
          },
          PROFILE_CREATED: {
            actions: () => console.log("init.profile.PROFILE_CREATED"),
            target: "profile",
          },
          GOT_PROFILE: {
            actions: [
              () => console.log("init.profile.NO_PROFILE"),
              "assignProfileToContext",
            ],
            target: "ubi",
          },
        },
      },
      ubi: {
        entry: () => console.log("init.ubi"),
        invoke: { src: "loadUbi" },
        on: {
          NO_UBI: {
            actions: () => console.log("init.ubi.NO_UBI"),
            target: "signupForUbi",
          },
          GOT_UBI: {
            actions: [
              () => console.log("init.ubi.GOT_UBI"),
              "assignUbiToContext",
            ],
            target: "finalize",
          },
        },
      },
      signupForUbi: {
        entry: () => console.log("init.signupForUbi"),
        invoke: {
          src: "signupForUbi",
          onDone: "success",
        },
        on: {
          UBI_ERROR: {
            actions: () => console.log("init.signupForUbi.UBI_ERROR"),
            target: "cancelled",
          },
          GOT_UBI: {
            actions: [
              () => console.log("init.signupForUbi.GOT_UBI"),
              "assignUbiToContext",
            ],
            target: "finalize",
          },
        },
      },
      finalize: {
        entry: () => console.log("init.finalize"),
        invoke: {
          src: "sendAuthenticatedEvent",
          onDone: "success",
        },
      },
      cancelled: {
        entry: () => console.log("init.cancelled"),
        type: "final",
      },
      success: {
        entry: [
          () => console.log("init.success"),
          () => {
            push("#/dashboard");
          },
        ],
        type: "final",
      },
    },
  },
  {
    services: {
      loadInitAggregateState: async (context) => {
        const apiClient = await window.o.apiClient.client.subscribeToResult();
        const result = await apiClient.query({
          query: InitAggregateStateDocument,
        });
        if (result.data?.initAggregateState) {
          context.initAggregateState = result.data.initAggregateState;
        }
      },
      loadSession: () => (callback) => {
        getSessionInfo()
          .then((sessionInfo) => {
            if (sessionInfo.isLoggedOn) {
              callback(<any>{ type: "GOT_SESSION", session: sessionInfo });
            } else {
              callback({ type: "NO_SESSION" });
            }
          })
          .catch((e) => {
            console.warn(
              `Couldn't determine the session state -> Assuming "NO_SESSION".`,
              e
            );
            callback({ type: "NO_SESSION" });
          });
      },
      loadRegistration: (ctx) => (callback) => {
        if (!ctx.session) throw new Error(`ctx.session is not set`);

        if (!ctx.session.profileId) {
          callback({ type: "NO_REGISTRATION" });
          return;
        }

        let email: string;

        window.o.apiClient.client
          .subscribeToResult()
          .then((apiClient) => {
            return apiClient.query({
              query: WhoamiDocument,
            });
          })
          .then((result) => {
            if (result.errors) {
              callback({
                type: "REGISTRATION_ERROR",
                error: new Error(
                  `Couldn't load the registration for the following reason: ${JSON.stringify(
                    result.errors
                  )}`
                ),
              });
            } else {
              email = result.data.whoami;
              return loadProfile(ctx.session.profileId);
            }
          })
          .then((profile) => {
            callback({
              type: "GOT_REGISTRATION",
              registration: {
                email: email,
                profileId: profile.id,
                circlesSafeOwner: profile.circlesSafeOwner,
                acceptedToSVersion: "", // TODO: Important in the context?
                subscribedToNewsletter: profile.newsletter,
              },
            });
          })
          .catch((e) => {
            callback({ type: "REGISTRATION_ERROR", error: e });
          });
      },
      loadClaimedInvitation: (ctx) => (callback) => {
        if (!ctx.registration) throw new Error(`ctx.registration is not set`);

        /*callback({type: "NO_INVITATION"});
      return;*/

        window.o.apiClient.client
          .subscribeToResult()
          .then((apiClient) => {
            return apiClient.query({
              query: ClaimedInvitationDocument,
            });
          })
          .then(async (result) => {
            if (result.errors) {
              callback({
                type: "INVITATION_ERROR",
                error: new Error(
                  `Couldn't load the registration for the following reason: ${JSON.stringify(
                    result.errors
                  )}`
                ),
              });
              return;
            }
            if (!result.data.claimedInvitation) {
              callback({ type: "NO_INVITATION" });
              return;
            }

            // TODO: Why is the any cast necessary for the "GOT_INVITATION" event?
            // callback({type: "NO_INVITATION"});
            callback(<InitEvent>{
              type: "GOT_INVITATION",
              invitation: result.data.claimedInvitation,
            });
          })
          .catch((e) => {
            callback({
              type: "INVITATION_ERROR",
              error: e,
            });
          });
      },
      loadProfile: (ctx) => (callback) => {
        // if (!ctx.invitation) throw new Error(`ctx.invitation is not set`);

        loadProfile()
          .then((profile) => {
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
                  circlesSafeOwner: profile.circlesSafeOwner,
                },
              });
            } else {
              callback({ type: "NO_PROFILE" });
            }
          })
          .catch((e) => {
            callback({ type: "PROFILE_ERROR", error: e });
          });
      },
      loadEoa: (ctx) => async (callback) => {
        if (!ctx.registration) throw new Error(`ctx.registration is not set`);

        const keyManager = new KeyManager(null);
        await keyManager.load();

        const key = sessionStorage.getItem("circlesKey");
        if (keyManager.torusKeyAddress && !key) {
          callback({ type: "LOCKED_EOA" });
          return;
        }

        if (!key || !ctx.registration.circlesSafeOwner) {
          callback({ type: "NO_EOA" });
          return;
        }
        try {
          const eoa = RpcGateway.get().eth.accounts.privateKeyToAccount(key);
          if (!eoa) {
            callback({
              type: "EOA_ERROR",
              error: new Error(
                `Couldn't derive the EOA address from the stored private key.`
              ),
            });
            return;
          }
          RpcGateway.get()
            .eth.getBalance(eoa.address)
            .then((balance) => {
              callback({
                type: "GOT_EOA",
                eoa: {
                  address: eoa.address,
                  privateKey: key,
                  origin: "Created",
                  balance: new BN(balance),
                },
              });
            })
            .catch((e) => {
              callback({ type: "EOA_ERROR", error: e });
            });
        } catch (e) {
          callback({ type: "EOA_ERROR", error: e });
        }
      },
      loadEoaInvitationTransaction: (ctx) => (callback) => {
        if (!ctx.eoa) throw new Error(`ctx.eoa is not set`);

        window.o.apiClient.client
          .subscribeToResult()
          .then((apiClient) => {
            return apiClient.query({
              query: InvitationTransactionDocument,
            });
          })
          .then((result) => {
            // TODO: Find the transaction from the "invitation EOA" to the user's EOA (must be the only outgoing transaction from the invite-eoa)
            if (
              result.errors ||
              !result.data?.invitationTransaction?.transaction_hash
            ) {
              callback({ type: "NOT_REDEEMED" });
            } else {
              callback({
                type: "GOT_REDEEMED",
                transaction: result.data.invitationTransaction.transaction_hash,
              });
            }
          });
      },
      loadSafe: (ctx) => (callback) => {
        loadProfile()
          .then((result) => {
            if (!result.circlesAddress) {
              callback({ type: "NO_SAFE" });
            } else {
              // TODO: Check if the safe is owned by the previously queried EOA.
              RpcGateway.get()
                .eth.getBalance(result.circlesAddress)
                .then((balance) => {
                  callback({
                    type: "GOT_SAFE",
                    safe: {
                      address: result.circlesAddress,
                      origin: "Created", // TODO: Find correct origin,
                      balance: new BN(balance),
                    },
                  });
                })
                .catch((error) => {
                  callback({
                    type: "SAFE_ERROR",
                    error: error,
                  });
                });
            }
          })
          .catch((error) => {
            callback({
              type: "SAFE_ERROR",
              error: error,
            });
          });
      },
      loadSafeInvitationTransaction: (ctx) => (callback) => {
        if (!ctx.safe) throw new Error(`ctx.safe is not set`);

        window.o.apiClient.client
          .subscribeToResult()
          .then((apiClient) => {
            return apiClient.query({
              query: SafeFundingTransactionDocument,
            });
          })
          .then((result) => {
            // TODO: Find the invitation transaction from the user's EOA to the safe (use IndexedTransactions from the API.)
            if (result.errors || !result.data.safeFundingTransaction) {
              callback({ type: "SAFE_NOT_FUNDED" });
            } else {
              callback({
                type: "GOT_SAFE_FUNDED",
                transaction: result.data.safeFundingTransaction,
              });
            }
          });
      },
      loadUbi: (ctx) => (callback) => {
        window.o.apiClient.client
          .subscribeToResult()
          .then((apiClient) =>
            apiClient.query({
              query: HubSignupTransactionDocument,
            })
          )
          .then((result) => {
            if (result.errors || !result.data.hubSignupTransaction) {
              callback({ type: "NO_UBI" });
            } else {
              callback({
                type: "GOT_UBI",
                ubi: <UbiData>{
                  tokenAddress: result.data.hubSignupTransaction.payload.token,
                },
              });
            }
          });

        // TODO: Check if the user's safe is already signed up at the UBI hub
      },
      signupForUbi: (ctx) => async (callback) => {
        const hub = new CirclesHub(RpcGateway.get(), HUB_ADDRESS);
        const privateKey = sessionStorage.getItem("circlesKey");
        if (!privateKey) throw new Error(`The private key is not unlocked`);
        const safeProxy = new GnosisSafeProxy(
          RpcGateway.get(),
          ctx.safe.address
        );
        const receipt = await (
          await hub.signup(privateKey, safeProxy)
        );
        console.log(receipt);
      },
      validateInvitation: async (context, event) => {
        send({ type: "INVITATION_USED" });
        // send({type: "INVITATION_UNUSED"});
      },
      sendAuthenticatedEvent: async (context) => {
        window.o.publishEvent(<PlatformEvent>{
          type: "shell.authenticated",
          profile: await loadProfile(),
        });
      },
    },
    actions: {
      acquireSessionAndRestart: () => {
        window.o.runProcess(acquireSession, {
          successAction: (data) => {
            (<any>window).runInitMachine();
          },
        });
      },
      upsertRegistrationAndRestart: () => {
        window.o.runProcess(upsertRegistration, {
          successAction: (data) => {
            (<any>window).runInitMachine();
          },
        });
      },
      promptGetInvitedAndRestart: () => {
        window.o.runProcess(promptGetInvited, {
          successAction: (data) => {
            (<any>window).runInitMachine();
          },
        });
      },
      upsertIdentityAndRestart: (context) => {
        window.o.runProcess(upsertIdentity, {
          id: context.registration.profileId,
          successAction: (data) => {
            (<any>window).runInitMachine();
          },
        });
      },
      unlockEoaAndRestart: (context) => {
        window.o.runProcess(unlockKey, {
          successAction: (data) => {
            (<any>window).runInitMachine();
          },
        });
      },
      promptConnectOrCreateAndRestart: (context) => {
        window.o.runProcess(promptConnectOrCreate, {
          successAction: (data) => {
            (<any>window).runInitMachine();
          },
        });
      },
      promptRedeemInvitationAndRestart: () => {
        window.o.runProcess(promptRedeemInvitation, {});
      },
      fundSafeFromEoaAndRestart: () => {
        loadProfile().then((profile) => {
          window.o.runProcess(fundSafeFromEoa, {
            successAction: (data) => {
              (<any>window).runInitMachine();
            },
            safeAddress: profile.circlesAddress,
            eoaAddress: profile.circlesSafeOwner,
          });
        });
      },
      assignSessionInfoToContext: assign({
        session: (ctx, event) => {
          return event.type == "GOT_SESSION" ? event.session : undefined;
        },
      }),
      assignRegistrationToContext: assign({
        registration: (ctx, event) => {
          return event.type == "GOT_REGISTRATION"
            ? event.registration
            : undefined;
        },
      }),
      assignInvitationToContext: assign({
        invitation: (ctx, event) => {
          return event.type == "GOT_INVITATION" ? event.invitation : undefined;
        },
      }),
      assignProfileToContext: assign({
        profile: (ctx, event) => {
          return event.type == "GOT_PROFILE" ? event.profile : undefined;
        },
      }),
      assignEoaToContext: assign({
        eoa: (ctx, event) => {
          return event.type == "GOT_EOA" ? event.eoa : undefined;
        },
      }),
      assignSafeToContext: assign({
        safe: (ctx, event) => {
          return event.type == "GOT_SAFE" ? event.safe : undefined;
        },
      }),
      assignEoaInvitationTransactionToContext: assign({
        eoaInvitationTransaction: (ctx, event) => {
          return event.type == "GOT_REDEEMED" ? event.transaction : undefined;
        },
      }),
      assignSafeInvitationTransactionToContext: assign({
        safeInvitationTransaction: (ctx, event) => {
          return event.type == "GOT_SAFE_FUNDED"
            ? event.transaction
            : undefined;
        },
      }),
      fundSafeFromEoa: () => {
        // TODO: Transfer the invitation amount minus 0.02 xDai from the user's EOA to the safe
        //       and index the transaction.
      },
      assignUbiToContext: assign({
        ubi: (ctx, event) => (event.type == "GOT_UBI" ? event.ubi : undefined),
      }),
    },
  }
);
