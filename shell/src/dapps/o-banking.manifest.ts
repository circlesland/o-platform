import Transactions from "./o-banking/pages/Transactions.svelte";
import Assets from "./o-banking/pages/Assets.svelte";
import Trusts from "./o-banking/pages/Trusts.svelte";
import ProfilePage from "./o-banking/pages/Profile.svelte";
import TransactionDetailPage from "./o-banking/pages/TransactionDetail.svelte";

import { transfer } from "./o-banking/processes/transfer";
import { init, tryGetCurrentSafe } from "./o-banking/init";
import { me } from "../shared/stores/me";
import FindMySafe from "./o-banking/pages/FindMySafe.svelte";
import { Profile } from "./o-banking/data/api/types";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import { Page } from "@o-platform/o-interfaces/dist/routables/page";
import { Trigger } from "@o-platform/o-interfaces/dist/routables/trigger";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { Jumplist } from "@o-platform/o-interfaces/dist/routables/jumplist";
import AssetDetail from "./o-banking/pages/AssetDetail.svelte";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { loadProfileByProfileId } from "./o-banking/data/loadProfileByProfileId";

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

    return [
      {
        key: "transfer",
        icon: "sendmoney",
        title: "Send Money",
        action: async () => {
          window.o.runProcess(transfer, {
            safeAddress: tryGetCurrentSafe().safeAddress,
            recipientAddress: recipientSafeAddress,
            privateKey: localStorage.getItem("circlesKey"),
          });
        },
      },
    ];
  },
};

export const profile: Page<any, BankingDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=profile", ":id"],
  title: "Profile",
  component: ProfilePage,
  jumplist: profileJumplist,
};

const transactionDetail: Page<{ _id: string }, BankingDappState> = {
  type: "page",
  isSystem: true,
  position: "modal",
  routeParts: ["=transactions", ":_id"],
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
const assetDetail: Page<{ symbol: string }, BankingDappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=assets", ":symbol"],
  component: AssetDetail,
  title: "Asset",
  type: "page",
};
const trusts: Page<any, BankingDappState> = {
  routeParts: ["=trusts"],
  component: Trusts,
  title: "Trusts",
  icon: "trusts",
  type: "page",
};
const sendInvite: Page<{ inviteAccountAddress: string }, BankingDappState> = {
  routeParts: ["=trusts", "=invite", ":inviteAccountAddress"],
  position: "modal",
  isSystem: true,
  component: Trusts,
  title: "Trusts",
  type: "page",
};
const trustDetail: Page<{ id: string }, BankingDappState> = {
  isSystem: true,
  position: "modal",
  routeParts: ["=trusts", ":id"],
  component: ProfilePage,
  title: "Trust",
  type: "page",
};
const findMySafe: Page<any, BankingDappState> = {
  isSystem: true,
  routeParts: ["=find-my-safe"],
  component: FindMySafe,
  title: "FindMySafe",
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
      me.subscribe((myProfile) => {
        resolve(myProfile);
      });
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
    trusts,
    assets,
    assetDetail,
    trustDetail,
    sendInvite,
    profile,
    findMySafe,
  ],
};
