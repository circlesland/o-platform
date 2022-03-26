import Transactions from "./o-banking/pages/Transactions.svelte";
import Assets from "./o-banking/pages/Assets.svelte";
import CrcDetail from "./o-banking/pages/CrcDetail.svelte";
import XDaiDetail from "./o-banking/pages/XDaiDetail.svelte";

import TransactionDetailPage from "./o-banking/pages/TransactionDetail.svelte";

import { transfer } from "./o-banking/processes/transfer";
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

const transactions: Page<any, BankingDappState> = {
  routeParts: ["=transactions"],
  component: Transactions,
  title: "Transactions",
  icon: "transactions",
  type: "page",
  navigation: {
    leftSlot: {
      component: ListComponent,
      props: {
        icon: "list",
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

    const recipientSafeAddress = params.id
      ? await getRecipientAddress()
      : undefined;

    let circlesAddress;
    const unsub = me.subscribe((o) => {
      circlesAddress = o?.circlesAddress;
    });
    unsub();

    return [
      {
        key: "transfer",
        icon: "sendmoney",
        title: "Send Money",
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
const transactionSend: Trigger<
  { to: string; amount: string; message: string },
  BankingDappState
> = {
  isSystem: true,
  routeParts: ["=transactions", "=send", ":to", ":amount", ":message"],
  title: "Transactions",
  type: "trigger",
  eventFactory: (params) => {
    // TODO: Implement payment smartlink
    throw new Error(`Not implemented`);
  },
};
const assets: Page<any, BankingDappState> = {
  routeParts: ["=assets"],
  component: Assets,
  title: "Assets",
  icon: "assets",
  type: "page",
};
const crcDetail: Page<{ symbol: string }, BankingDappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=assets", "=time"],
  basePage: ["assets"],
  component: CrcDetail,
  title: "Asset",
  type: "page",
};
const xdaiDetail: Page<{ symbol: string }, BankingDappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=assets", "=xdai"],
  basePage: ["assets"],
  component: XDaiDetail,
  title: "Asset",
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
  routables: [
    transactions,
    transactionDetail,
    transactionSend,
    assets,
    crcDetail,
    xdaiDetail,
  ],
};
