import {assign, createMachine} from "xstate";
import {SafeInfo, Profile, SafeInfoDocument, SafeInfoQueryVariables} from "./api/data/types";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {CirclesAccount} from "@o-platform/o-circles/dist/model/circlesAccount";
import {me} from "./stores/me";
import {ApiClient} from "./apiConnection";
import {Environment} from "./environment";

export type UbiTimerContext = {
  nextUbiAt: number|null
  tokenAddress: string|null
};

export type UbiEvents = {
  type: "GOT_PREVIOUS_PAYOUT",
  lastPayoutAt: Date,
  randomValue: String
} | {
  type: "NO_PREVIOUS_PAYOUT",
  randomValue: String
}

export const ubiMachine = createMachine<UbiTimerContext, UbiEvents>({
  id: `ubi`,
  initial: "waitFor5Seconds",
  context: {
    nextUbiAt: null,
    tokenAddress: null
  },
  states: {
    waitFor60Seconds: {
      entry: (context, event) => {
        console.log("Waiting for 60 sec. until next UBI-retrieval try. Previous event was:", event);
      },
      after: {
        60000: "checkLastPayout"
      }
    },
    waitFor5Seconds: {
      entry: (context, event) => {
        console.log("Waiting for 5 sec. until next UBI-retrieval try. Previous event was:", event);
      },
      after: {
        5000: "checkLastPayout"
      }
    },
    checkLastPayout: {
      invoke: {
        src: "getUbiInfo"
      },
      on: {
        GOT_PREVIOUS_PAYOUT: [{
          cond: "previousPayoutIsNewerThan24Hours",
          actions: "calculateAndAssignNextUbiAt",
          target: "waitForNextUbiAt"
        },{
          cond: "previousPayoutIsOlderThan24Hours",
          target: "getUbi"
        }],
        NO_PREVIOUS_PAYOUT: [{
          cond: "noUbiInfo",
          target: "waitFor60Seconds"
        }, {
          target: "getUbi"
        }]
      }
    },
    waitForNextUbiAt: {
      after: {
        NEXT_UBI_DELAY: "getUbi"
      }
    },
    getUbi: {
      entry: "clearContext",
      invoke: {
        src: "getUbi",
        onDone: "waitFor5Seconds",
        onError: "waitFor5Seconds"
      }
    }
  }
}, {
  guards: {
    noUbiInfo: (ctx, event) => !ctx.tokenAddress,
    previousPayoutIsNewerThan24Hours: (ctx, event: {type: "GOT_PREVIOUS_PAYOUT", lastPayoutAt:Date, randomValue:string}) => Date.now() < event.lastPayoutAt.getTime() + (24 * 60 * 60 * 1000),
    previousPayoutIsOlderThan24Hours: (ctx, event: {type: "GOT_PREVIOUS_PAYOUT", lastPayoutAt:Date, randomValue:string}) => Date.now() >= event.lastPayoutAt.getTime() + (24 * 60 * 60 * 1000)
  },
  delays: {
    NEXT_UBI_DELAY: (context, event) => {
      return context.nextUbiAt - Date.now();
    }
  },
  services: {
    getUbi: async (context) => {
      let $me: Profile|null = null;
      const unsub = me.subscribe(o => {
        $me = o;
      });
      unsub();
      if (!$me)
        throw new Error(`Couldn't load your profile`);

      const privateKey = sessionStorage.getItem("circlesKey");
      if (!privateKey)
        throw new Error(`Your private key is locked.`);

      if (!context.tokenAddress)
        throw new Error(`Cannot get the ubi. The context.tokenAddress is empty.`);

      const gnosisSafeProxy = new GnosisSafeProxy(RpcGateway.get(), $me.circlesAddress);
      const circlesAccount = new CirclesAccount($me.circlesAddress, Environment.circlesHubAddress);
      const result = await circlesAccount.getUBI(privateKey, gnosisSafeProxy, context.tokenAddress);
      console.log(`Ubi request result (transactionHash):`, result.transactionHash);
      return result;
    },
    getUbiInfo: (context) => async (callback) => {
      const ubiInfo = await ApiClient.query<SafeInfo, SafeInfoQueryVariables>(SafeInfoDocument, {});
      if (!ubiInfo) {
        console.log(`No ubiInfo.`);
        callback({
          type: "GOT_PREVIOUS_PAYOUT",
          lastPayoutAt: new Date(parseFloat(ubiInfo.lastUbiAt)),
          randomValue: ubiInfo.randomValue
        });
        return;
      }
      if (ubiInfo.safeAddress && ubiInfo.tokenAddress) {
        context.tokenAddress = ubiInfo.tokenAddress;
      }
      if (ubiInfo.lastUbiAt) {
        callback({
          type: "GOT_PREVIOUS_PAYOUT",
          lastPayoutAt: new Date(parseFloat(ubiInfo.lastUbiAt)),
          randomValue: ubiInfo.randomValue
        });
      } else {
        callback({
          type: "NO_PREVIOUS_PAYOUT",
          randomValue: ubiInfo.randomValue
        });
      }
    }
  },
  actions: {
    clearContext: assign({
      nextUbiAt: () => null,
      tokenAddress: (context) => context.tokenAddress
    }),
    calculateAndAssignNextUbiAt: assign({
      nextUbiAt: (ctx, event:UbiEvents) => {
        const nextUbiAt = event.type === "GOT_PREVIOUS_PAYOUT"
          ? event.lastPayoutAt.getTime() + (24 * 60 * 60 * 1000) + Math.ceil((event.randomValue.charCodeAt(0) - 32) * 1000)
          : null;
        console.log("nextUbiAt:", nextUbiAt);
        return nextUbiAt;
      }
    })
  }
});