import { assign, createMachine, send } from "xstate";
import { BN } from "ethereumjs-util";
import { loadProfile } from "../../o-passport/processes/identify/services/loadProfile";
import {
  ClaimedInvitation,
  ClaimedInvitationDocument,
  ClaimedInvitationQueryVariables,
  CrcSignup,
  HubSignupTransactionDocument,
  HubSignupTransactionQueryVariables, InitDocument, InitQueryVariables,
  InvitationTransactionDocument,
  InvitationTransactionQueryVariables, Profile,
  ProfileEvent
} from "../../../shared/api/data/types";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { upsertIdentity } from "../../o-passport/processes/upsertIdentity";
import { upsertRegistration } from "./registration/promptRegistration";
import { promptConnectOrCreate } from "./connectOrCreate/promptConnectOrCreate";
import { promptRedeemInvitation } from "./invitation/promptRedeemInvitation";
import { promptGetInvited } from "./invitation/promptGetInvited";
import { acquireSession } from "../../o-passport/processes/identify/acquireSession/acquireSession2";
import { CirclesHub } from "@o-platform/o-circles/dist/circles/circlesHub";
import { GnosisSafeProxy } from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { KeyManager } from "../../o-passport/data/keyManager";
import { unlockKey } from "./unlockKey/unlockKey";
import { InitEvent, UbiData } from "./initEvent";
import { InitContext } from "./initContext";
import { push } from "svelte-spa-router";
import { ApiClient } from "../../../shared/apiConnection";
import { Environment } from "../../../shared/environment";
import {me} from "../../../shared/stores/me";

export const initMachine = createMachine<InitContext, InitEvent>(
  {
    id: `init`,
    initial: "prepare",
    context: {
      session: null,
      openLoginUserInfo: null,
      registration: null,
      invitation: null,
      profile: null,
      eoa: null,
      eoaInvitationTransaction: null,
      safe: null,
      ubi: null,
    },
    on: {
      CANCEL: "cancelled",
    },
    states: {
      prepare: {
        entry:() => {
          window.o.publishEvent({
            type: "shell.openModalProcess",
          });
        },
        invoke: {
          src: async(context) => {
            const initResult:any = await ApiClient.query<Profile, InitQueryVariables>(InitDocument, {});
            console.log("initResult:", initResult);

            if (initResult.profile.circlesSafeOwner) {
              context.eoa = {
                address: initResult.profile.circlesSafeOwner,
                origin: "Created",
                balance: undefined,
                privateKey: undefined
              };
              context.registration = {
                email: initResult.profile.emailAddress,
                profileId: initResult.profile.id,
                subscribedToNewsletter: initResult.profile.newsletter,
                circlesSafeOwner: initResult.profile.circlesSafeOwner,
                acceptedToSVersion: undefined,
                successorOfCirclesAddress: undefined
              };
              context.profile = {
                id: initResult.profile.id,
                circlesAddress: initResult.profile.circlesAddress,
                avatarUrl: initResult.profile.avatarUrl,
                circlesSafeOwner: initResult.profile.circlesSafeOwner,
                cityId: undefined,
                firstName: initResult.profile.firstName,
                lastName: initResult.profile.lastName,
                passion: initResult.profile.dream
              };
              context.safe = {
                address: initResult.profile.circlesAddress,
                origin: "Created"
              };
              context.invitation = {
                ...initResult.profile.claimedInvitation
              };
              context.eoaInvitationTransaction = {
                ...initResult.profile.invitationTransaction
              };
              context.ubi = {
                tokenAddress: initResult.profile.circlesTokenAddress
              };
            }
          },
          onDone: [{
            cond: context => !!context.eoa && !sessionStorage.getItem("circlesKey") && !!localStorage.getItem("circlesKeys"),
            actions: () => console.log(`!!context.eoa && !sessionStorage.getItem("circlesKey")  -->  tryUnlockEoa`),
            target: "eoa.tryUnlockEoa"
          },{
            cond: context => !!context.safe?.address && !!context.ubi?.tokenAddress,
            actions: () => console.log(`!!context.safe?.address && !!context.ubi?.tokenAddress  -->  init.finalize`),
            target: "finalize"
          }, {
            cond: context => !!context.safe?.address && !!context.profile?.firstName && context.profile?.firstName != "",
            actions: () => console.log(`!!context.safe?.address && !!context.profile?.firstName && context.profile?.firstName != ""  -->  init.ubi`),
            target: "ubi"
          }, {
            cond: context => !!context.invitation?.claimedAt && !!context.safe?.address,
            actions: () => console.log(`!!context.invitation?.claimedAt && !!context.safe?.address  -->  init.profile`),
            target: "profile"
          }, {
            cond: context => !!context.registration?.circlesSafeOwner && !!context.invitation?.claimedAt,
            actions: () => console.log(`!!context.registration?.circlesSafeOwner && !!context.invitation?.claimedAt  -->  init.eoa.redeemInvitation`),
            target: "eoa.redeemInvitation"
          }, {
            cond: context => !!context.registration?.profileId && !!context.registration?.circlesSafeOwner,
            actions: () => console.log(`!!context.registration?.profileId && !!context.registration?.circlesSafeOwner  -->  init.invitation`),
            target: "invitation"
          }, {
            actions: () => console.log(`catch-all  -->  init.initial`),
            target: "initial"
          }],
          onError: "initial"
        }
      },
      initial: {
        entry: [() => console.log("init.initial")],
        invoke: { src: "loadSession" },
        on: {
          NO_SESSION: {
            actions: [
              () => console.log("init.initial:NO_SESSION"),
              "acquireSessionAndRestart",
            ],
          },
          GOT_SESSION: {
            actions: [
              () => console.log("init.initial:GOT_SESSION"),
              "assignSessionInfoToContext",
            ],
            target: "register",
          },
        },
      },
      register: {
        entry: () => {
          console.log("init.register");

          window.o.publishEvent({
            type: "shell.openModalProcess",
          });
        },
        invoke: { src: "loadRegistration" },
        on: {
          NO_REGISTRATION: {
            actions: [
              () => console.log("init.register:NO_REGISTRATION"),
              "upsertRegistrationAndRestart",
            ],
          },
          REGISTRATION_ERROR: {
            actions: [
              () => console.log("init.register:REGISTRATION_ERROR"),
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
                      type: "shell.openModalProcess",
                    });
                    window.o.publishEvent(<any>{
                      type: "shell.progress",
                      message: "Starting your session ..",
                    });
                  },
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
                target: "safeReady",
              },
            },
          },
          connectOrCreate: {
            entry: [
              () => console.log("init.safe.connectOrCreate"),
              (context) => {
                window.o.runProcess(promptConnectOrCreate, {
                  forceCreate:
                    context.profile.successorOfCirclesAddress &&
                    !context.profile.circlesAddress,
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
            actions: ["upsertIdentityAndRestart"],
          },
          PROFILE_CREATED: {
            target: "profile",
          },
          GOT_PROFILE: {
            actions: ["assignProfileToContext"],
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
            push("#/home");
          },
        ],
        type: "final",
      },
    },
  },
  {
    services: {
      loadSession: () => async (callback) => {
        try {
          const sessionInfo = await me.getSessionInfo();
          if (sessionInfo.isLoggedOn) {
            callback(<any>{ type: "GOT_SESSION", session: sessionInfo });
          } else {
            callback({ type: "NO_SESSION" });
          }
        } catch (e) {
          console.error(
            `Couldn't determine the session state -> Assuming "NO_SESSION".`,
            e
          );
          callback({ type: "NO_SESSION" });
        }
      },
      loadRegistration: (ctx) => async (callback) => {
        if (!ctx.session) throw new Error(`ctx.session is not set`);

        if (!ctx.session.profileId) {
          callback({ type: "NO_REGISTRATION" });
          return;
        }

        try {
          const profile = await loadProfile(ctx.session.profileId);

          callback({
            type: "GOT_REGISTRATION",
            registration: {
              email: profile.emailAddress,
              profileId: profile.id,
              circlesSafeOwner: profile.circlesSafeOwner,
              acceptedToSVersion: "", // TODO: Important in the context?
              subscribedToNewsletter: profile.newsletter,
              successorOfCirclesAddress: profile.successorOfCirclesAddress,
            },
          });
        } catch (e) {
          callback({
            type: "REGISTRATION_ERROR",
            error: e,
          });
        }
      },
      loadClaimedInvitation: (ctx) => async (callback) => {
        if (!ctx.registration) throw new Error(`ctx.registration is not set`);

        try {
          const claimedInvitation = await ApiClient.query<
            ClaimedInvitation,
            ClaimedInvitationQueryVariables
          >(ClaimedInvitationDocument, {});

          if (claimedInvitation) {
            callback(<InitEvent>{
              type: "GOT_INVITATION",
              invitation: claimedInvitation,
            });
          } else {
            callback({ type: "NO_INVITATION" });
          }
        } catch (e) {
          callback({
            type: "INVITATION_ERROR",
            error: e,
          });
        }
      },
      loadProfile: (ctx) => async (callback) => {
        try {
          const profile = await loadProfile();
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
                successorOfCirclesAddress: profile.successorOfCirclesAddress,
                circlesSafeOwner: profile.circlesSafeOwner,
              },
            });
          } else {
            callback({ type: "NO_PROFILE" });
          }
        } catch (e) {
          callback({ type: "PROFILE_ERROR", error: e });
        }
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

          const balance = await RpcGateway.get().eth.getBalance(eoa.address);
          callback({
            type: "GOT_EOA",
            eoa: {
              address: eoa.address,
              privateKey: key,
              origin: "Created",
              balance: new BN(balance),
            },
          });
        } catch (e) {
          callback({ type: "EOA_ERROR", error: e });
        }
      },
      loadEoaInvitationTransaction: (ctx) => async (callback) => {
        if (!ctx.eoa) throw new Error(`ctx.eoa is not set`);

        // TODO: This is missing an error response
        const invitationTransaction = await ApiClient.query<
          ProfileEvent,
          InvitationTransactionQueryVariables
        >(InvitationTransactionDocument, {});

        if (invitationTransaction) {
          callback({
            type: "GOT_REDEEMED",
            transaction: invitationTransaction,
          });
        } else {
          callback({ type: "NOT_REDEEMED" });
        }
      },
      loadSafe: (ctx) => async (callback) => {
        try {
          const profile = await loadProfile();
          ctx.profile = <any>(ctx.profile
            ? {
                ...ctx.profile,
                successorOfCirclesAddress: profile.successorOfCirclesAddress,
                circlesAddress: profile.circlesAddress,
              }
            : {
                successorOfCirclesAddress: profile.successorOfCirclesAddress,
                circlesAddress: profile.circlesAddress,
              });

          if (profile?.circlesAddress) {
            callback({
              type: "GOT_SAFE",
              safe: {
                address: profile.circlesAddress,
                origin: "Created", // TODO: Find correct origin
              },
            });
          } else {
            callback({ type: "NO_SAFE" });
          }
        } catch (e) {
          callback({
            type: "SAFE_ERROR",
            error: e,
          });
        }
      },
      loadUbi: (ctx) => async (callback) => {
        // TODO: This is missing an error response
        const hubSignupTransaction = await ApiClient.query<
          ProfileEvent,
          HubSignupTransactionQueryVariables
        >(HubSignupTransactionDocument, {});

        if (hubSignupTransaction?.payload) {
          callback({
            type: "GOT_UBI",
            ubi: <UbiData>{
              tokenAddress: (<CrcSignup>hubSignupTransaction.payload).token,
            },
          });
        } else {
          callback({ type: "NO_UBI" });
        }
      },
      signupForUbi: (ctx) => async (callback) => {
        const hub = new CirclesHub(
          RpcGateway.get(),
          Environment.circlesHubAddress
        );
        const privateKey = sessionStorage.getItem("circlesKey");
        if (!privateKey) throw new Error(`The private key is not unlocked`);
        const safeProxy = new GnosisSafeProxy(
          RpcGateway.get(),
          ctx.safe.address
        );
        const receipt = await await hub.signup(privateKey, safeProxy);
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
            (<any>window).runInitMachine({
              openLoginUserInfo: data.userInfo
            });
          },
        });
      },
      upsertRegistrationAndRestart: (context) => {
        window.o.runProcess(upsertRegistration, {
          emailAddress: context.openLoginUserInfo?.email,
          firstName: context.openLoginUserInfo?.name,
          avatarUrl: context.openLoginUserInfo?.profileImage,
          successAction: (data) => {
            (<any>window).runInitMachine(context);
          },
        });
      },
      promptGetInvitedAndRestart: (context) => {
        window.o.runProcess(promptGetInvited, {
          successAction: (data) => {
            (<any>window).runInitMachine(context);
          },
        });
      },
      upsertIdentityAndRestart: (context) => {
        window.o.runProcess(upsertIdentity, {
          id: context.registration.profileId,
          successAction: (data) => {
            (<any>window).runInitMachine(context);
          },
        });
      },
      unlockEoaAndRestart: (context) => {
        window.o.runProcess(unlockKey, {
          successAction: (data) => {
            (<any>window).runInitMachine(context);
          },
        });
      },
      promptConnectOrCreateAndRestart: (context) => {
        window.o.runProcess(promptConnectOrCreate, {
          forceCreate:
            context.profile.successorOfCirclesAddress &&
            !context.profile.circlesAddress,
          successAction: (data) => {
            (<any>window).runInitMachine(context);
          },
        });
      },
      promptRedeemInvitationAndRestart: () => {
        window.o.runProcess(promptRedeemInvitation, {});
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
      assignUbiToContext: assign({
        ubi: (ctx, event) => (event.type == "GOT_UBI" ? event.ubi : undefined),
      }),
    },
  }
);
