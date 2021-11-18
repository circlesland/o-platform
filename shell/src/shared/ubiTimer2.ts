import {assign, createMachine} from "xstate";
import {LastUbiTransactionDocument, Profile} from "./api/data/types";
import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {CirclesAccount} from "@o-platform/o-circles/dist/model/circlesAccount";
import {me} from "./stores/me";

export type UbiTimerContext = {
  nextUbiAt: number|null
};

export type UbiEvents = {
  type: "GOT_PREVIOUS_PAYOUT",
  lastPayoutAt: Date
} | {
  type: "NO_PREVIOUS_PAYOUT",
}

export const ubiMachine = createMachine<UbiTimerContext, UbiEvents>({
  id: `ubi`,
  initial: "waitFor60Seconds",
  context: {
    nextUbiAt: null
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
    checkLastPayout: {
      invoke: {
        src: "getLastUbiRetrievalDate"
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
        NO_PREVIOUS_PAYOUT: "getUbi"
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
        onDone: "waitFor60Seconds",
        onError: "waitFor60Seconds"
      }
    }
  }
}, {
  guards: {
    previousPayoutIsNewerThan24Hours: (ctx, event: {type: "GOT_PREVIOUS_PAYOUT", lastPayoutAt:Date}) => Date.now() < event.lastPayoutAt.getTime() + (24 * 60 * 60 * 1000),
    previousPayoutIsOlderThan24Hours: (ctx, event: {type: "GOT_PREVIOUS_PAYOUT", lastPayoutAt:Date}) => Date.now() >= event.lastPayoutAt.getTime() + (24 * 60 * 60 * 1000)
  },
  delays: {
    NEXT_UBI_DELAY: (context, event) => context.nextUbiAt - Date.now()
  },
  services: {
    getUbi: async () => {
      let $me: Profile|null = null;
      const unsub = me.subscribe(o => {
        $me = o;
      });
      unsub();
      if (!$me)
        throw new Error(`Couldn't load your profile`);

      const privateKey = sessionStorage.getItem("circlesKey");
      if (!privateKey)
        throw new Error(`Your private key is locked.`)

      const gnosisSafeProxy = new GnosisSafeProxy(RpcGateway.get(), $me.circlesAddress);
      const circlesAccount = new CirclesAccount($me.circlesAddress);
      const result = await circlesAccount.getUBI(privateKey, gnosisSafeProxy);
      return result.toPromise().then(o => {
        console.log(`Ubi request result (transactionHash):`, o.transactionHash);
        return o;
      });
    },
    getLastUbiRetrievalDate: () => async (callback) => {
      const apiClient = await window.o.apiClient.client.subscribeToResult();
      const result = await apiClient.query({
        query: LastUbiTransactionDocument
      });
      if ((result.errors && result.errors.length) || !result.data.lastUBITransaction) {
        callback({
          type: "NO_PREVIOUS_PAYOUT"
        });
      } else {
        callback({
          type: "GOT_PREVIOUS_PAYOUT",
          lastPayoutAt: new Date(Date.parse(result.data.lastUBITransaction))
        });
      }
    }
  },
  actions: {
    clearContext: assign({
      nextUbiAt: null
    }),
    calculateAndAssignNextUbiAt: assign({
      nextUbiAt: (ctx, event:UbiEvents) => event.type === "GOT_PREVIOUS_PAYOUT"
        ? event.lastPayoutAt.getTime() + (24 * 60 * 60 * 1000)
        : null
    })
  }
});