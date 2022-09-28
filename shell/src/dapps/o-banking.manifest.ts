import Transactions from "./o-banking/pages/Transactions.svelte";
import Assets from "./o-banking/pages/Assets.svelte";
import CrcDetail from "./o-banking/pages/CrcDetail.svelte";
import XDaiDetail from "./o-banking/pages/XDaiDetail.svelte";

import TransactionDetailPage from "./o-banking/pages/TransactionDetail.svelte";

import { transfer, TransferContextData } from "./o-banking/processes/transfer";
import { init } from "./o-banking/init";
import { me } from "../shared/stores/me";

import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { Trigger } from "@o-platform/o-interfaces/dist/routables/trigger";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { Jumplist } from "@o-platform/o-interfaces/dist/routables/jumplist";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { loadProfileByProfileId } from "../shared/api/loadProfileByProfileId";
import { Profile } from "../shared/api/data/types";
import { push } from "svelte-spa-router";
import Erc721Detail from "./o-banking/pages/Erc721Detail.svelte";
// import {getUbi, getUbiInfo} from "../shared/ubiTimer2";

const transactions: Page<any, BankingDappState> = {
  routeParts: ["=transactions"],
  component: Transactions,
  title: "common.transactions",
  icon: "transactions",
  type: "page",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "banking",
        backgroundColorClass: "banking",
        // action: () => processNavigation.back(),
      },
    },
  },
};

const profileJumplist: Jumplist<any, BankingDappState> = {
  type: "jumplist",
  title: "Actions",
  isSystem: false,
  routeParts: ["=actions"],
  items: async (params, runtimeDapp) => {
    const getRecipientAddress = async () => {
      if (RpcGateway.get().utils.isAddress(params.id)) {
        return params.id;
      } else if (Number.isInteger(params.id)) {
        const profile = await loadProfileByProfileId(parseInt(params.id));
        if (profile) {
          return profile.circlesAddress;
        }
      }
      return undefined;
    };

    const recipientSafeAddress = params.id ? await getRecipientAddress() : undefined;

    let circlesAddress;
    const unsub = me.subscribe((o) => {
      circlesAddress = o?.circlesAddress;
    });
    unsub();

    return [
      {
        key: "transfer",
        icon: "cash",
        title: "Send Money",
        displayHint: "encouraged",
        category: "Banking",
        action: async () => {
          window.o.runProcess(transfer, {
            safeAddress: circlesAddress,
            recipientAddress: recipientSafeAddress,
            privateKey: sessionStorage.getItem("circlesKey"),
          });
        },
      },
    ];
  },
};

const transactionDetail: Page<{ transactionHash: string }, BankingDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=transactions", ":transactionHash"],
  title: "Transaction",
  component: TransactionDetailPage,
  jumplist: profileJumplist,
};

const assets: Page<any, BankingDappState> = {
  routeParts: ["=assets"],
  component: Assets,
  title: "common.assets",
  icon: "assets",
  type: "page",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "banking",
        backgroundColorClass: "banking",
        // action: () => processNavigation.back(),
      },
    },
  },
};
/*
const nfts: Page<any, BankingDappState> = {
  routeParts: ["=nfts"],
  component: Erc721Detail,
  title: "NFTs",
  icon: "assets",
  type: "page",
};
 */

const transferTrigger: Trigger<any, BankingDappState> = {
  routeParts: ["=send", ":amount", ":to"],
  action: async (params: any, runtimeDapp: DappManifest<any>) => {
    const $me = handleTransferTrigger(params);
    window.o.runProcess(transfer, <TransferContextData>{
      safeAddress: $me.circlesAddress,
      recipientAddress: params.to,
      tokens: {
        currency: "crc",
        amount: params.amount,
      },
    });
  },
  title: "common.sendMoney",
  icon: "cash",
  type: "trigger",
};

const transferTriggerRedirect: Trigger<any, BankingDappState> = {
  routeParts: ["=send", ":amount", ":to", ":redirectUrl"],
  action: async (params: any, runtimeDapp: DappManifest<any>) => {
    const $me = handleTransferTrigger(params);
    window.o.runProcess(transfer, <TransferContextData>{
      safeAddress: $me.circlesAddress,
      recipientAddress: params.to,
      tokens: {
        currency: "crc",
        amount: params.amount,
      },
      successAction: (context) => {
        window.location = params.redirectUrl;
        /*console.log("Transfer completed");
        window.close();*/
      },
    });
  },
  title: "common.sendMoney",
  icon: "cash",
  type: "trigger",
};

function handleTransferTrigger(params) {
  let $me: Profile;
  me.subscribe((me) => ($me = me))();
  console.log(params);
  if (!RpcGateway.get().utils.isAddress(params.to)) {
    return $me;
  }
  if (!sessionStorage.getItem("circlesKey")) {
    sessionStorage.setItem(
      "desiredRoute",
      JSON.stringify({
        dappId: "banking",
        "1": "send",
        "2": params.amount,
        "3": params.to,
        "4": params.redirectUrl,
      })
    );
    push("/");
    return $me;
  }
  return $me;
}

const crcDetail: Page<{ symbol: string }, BankingDappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=assets", "=time"],
  basePage: ["assets"],
  component: CrcDetail,
  title: "common.asset",
  type: "page",
};
const xdaiDetail: Page<{ symbol: string }, BankingDappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=assets", "=xdai"],
  basePage: ["assets"],
  component: XDaiDetail,
  title: "common.asset",
  type: "page",
};

export interface DappState {
  // put state here
}

export class BankingDappState {
  /**
   * The currently displayed profile (e.g. in the profile detail)
   */
  currentProfileId?: number;
  /**
   * The address of the currently displayed safe (e.g. in the profile detail)
   */
  currentSafeAddress?: string;

  trusted?: boolean;
}

export const banking: DappManifest<BankingDappState> = {
  dappId: "banking:1",
  type: "dapp",
  isSingleton: true,
  isHidden: false,
  icon: "banking",
  title: "Banking",
  routeParts: ["banking"],
  defaultRoute: ["transactions"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  jumplist: profileJumplist,

  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    const myProfileResult = await new Promise<Profile>((resolve) => {
      const unsub = me.subscribe((myProfile) => {
        resolve(myProfile);
      });
      unsub();
    });

    if (myProfileResult) {
      await init();
    }

    return {
      initialRoutable: transactions,
      cancelDependencyLoading: false,
    };
  },
  routables: [transactions, transactionDetail, assets, crcDetail, xdaiDetail, transferTrigger, transferTriggerRedirect],
};
