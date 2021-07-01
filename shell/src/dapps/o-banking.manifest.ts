import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import Transactions from "./o-banking/pages/Transactions.svelte";
import TransactionDetail from "./o-banking/pages/TransactionDetail.svelte";
import Assets from "./o-banking/pages/Assets.svelte";
import AssetDetail from "./o-banking/pages/AssetDetail.svelte";
import Trusts from "./o-banking/pages/Trusts.svelte";
import Graph from "./o-banking/pages/Graph.svelte";
import ProfilePage from "./o-banking/molecules/Profile.svelte";
import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
import {
  shellProcess,
  ShellProcessContext,
} from "../shared/processes/shellProcess";
import { setTrust } from "./o-banking/processes/setTrust";
import { transfer } from "./o-banking/processes/transfer";
import { init, tryGetCurrentSafe } from "./o-banking/init";
import { me } from "../shared/stores/me";
import FindMySafe from "./o-banking/pages/FindMySafe.svelte";
import { Profile } from "./o-banking/data/api/types";
import ActionButtonComponent from "../shared/molecules/NextNav/Components/ActionButton.svelte";
import ListComponent from "../shared/molecules/NextNav/Components/List.svelte";
import LinkComponent from "../shared/molecules/NextNav/Components/Link.svelte";
import {showProfile} from "./o-banking/processes/showProfile";
import {Generate} from "@o-platform/o-utils/dist/generate";
import {Page} from "@o-platform/o-interfaces/dist/routables/page";
import {Trigger} from "@o-platform/o-interfaces/dist/routables/trigger";
import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";

const transactions : Page<any, DappState> = {
  routeParts: ["transactions"],
  component: Transactions,
  title: "Transactions",
  type: "page"
};
export const profile : Trigger = {
  type: "trigger",
  isSystem: true,
  routeParts: ["profile", ":id"],
  title: "Profile",
  eventFactory:(params, runtimeDapp) => {
    const modifier = async (ctx) => {
      ctx.childProcessDefinition = showProfile;
      ctx.childContext = {
        data: {
          id: params.id,
        },
      };
      return ctx;
    };
    const requestEvent = new RunProcess(shellProcess, true, modifier);
    (<any>requestEvent).id = Generate.randomHexString(8);

    return requestEvent;
  }
};
type TransactionDetailParams = {
  _id:string
};
const transactionDetail : Page<TransactionDetailParams, BankingDappState> = {
  type: "page",
  isSystem: true,
  routeParts: ["transactions", ":_id"],
  component: TransactionDetail,
  title: "Transaction",
  jumplist: {
    type: "jumplist",
    title: "Actions",
    isSystem: false,
    routeParts: ["actions"],
    items: (params, runtimeDapp) => {
      const transferEvent = new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = transfer;
            ctx.childContext = {
              data: {
                safeAddress: tryGetCurrentSafe().safeAddress,
                recipientAddress: runtimeDapp.state.currentSafeAddress,
                privateKey: localStorage.getItem("circlesKey"),
              },
            };
            return ctx;
          }
      );

      const toggleTrustEvent = new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = setTrust;
            ctx.childContext = {
              data: {
                trustLimit: runtimeDapp.state.trusted ? 0 : 100,
                trustReceiver: runtimeDapp.state.currentSafeAddress,
                safeAddress: tryGetCurrentSafe().safeAddress,
                privateKey: localStorage.getItem("circlesKey"),
              },
            };
            return ctx;
          }
      );
      return [{
        key: "transfer",
        icon: "sendmoney",
        label: "Send Money",
        event: transferEvent
      },{
        key: "setTrust",
        icon: "trust",
        label: runtimeDapp.state.trusted ? "Untrust" : "Trust",
        event: toggleTrustEvent
      }];
    }
  }
};
const transactionSend : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["transactions", "send", ":to", ":amount", ":message"],
  component: Transactions,
  title: "Transactions",
  type: "page"
};
const tokens : Page<any, DappState> = {
  routeParts: ["assets"],
  component: Assets,
  title: "Assets",
  type: "page"
};
const tokenDetail : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["assets", ":symbol"],
  component: AssetDetail,
  title: "Asset",
  type: "page"
};
const trusts : Page<any, DappState> = {
  routeParts: ["trusts"],
  component: Trusts,
  title: "Trusts",
  type: "page"
};
const sendInvite : Page<any, DappState> = {
  routeParts: ["trusts", "invite", ":inviteAccountAddress"],
  isSystem: true,
  component: Trusts,
  title: "Trusts",
  type: "page"
};
const trustDetail : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["trusts", ":id"],
  component: ProfilePage,
  title: "Trust",
  type: "page"
};
const findMySafe : Page<any, DappState> = {
  isSystem: true,
  routeParts: ["find-my-safe"],
  component: FindMySafe,
  title: "FindMySafe",
  type: "page"
};
const graph : Page<any, DappState> = {
  routeParts: ["network"],
  component: Graph,
  title: "Network",
  type: "page"
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
  icon: faPeopleArrows,
  title: "Banking",
  routeParts: ["banking"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  jumplist: {
    type: "jumplist",
    title: "Actions",
    isSystem: false,
    routeParts: ["actions"],
    items: (params, runtimeDapp) => {
      return [{
        key: "setTrust",
        label: "Trust someone",
        icon: "trust",
        event: new RunProcess<ShellProcessContext>(
              shellProcess,
              true,
              async (ctx) => {
                ctx.childProcessDefinition = setTrust;
                ctx.childContext = {
                  data: {
                    trustLimit: 100,
                    safeAddress: tryGetCurrentSafe().safeAddress,
                    privateKey: localStorage.getItem("circlesKey"),
                  },
                };
                return ctx;
              }
          )
      },
        {
          key: "transfer",
          icon: "sendmoney",
          label: "Send Money",
          event: new RunProcess<ShellProcessContext>(
                shellProcess,
                true,
                async (ctx) => {
                  ctx.childProcessDefinition = transfer;
                  ctx.childContext = {
                    data: {
                      safeAddress: tryGetCurrentSafe().safeAddress,
                      recipientAddress: runtimeDapp.state.currentSafeAddress,
                      privateKey: localStorage.getItem("circlesKey"),
                    },
                  };
                  return ctx;
                }
            )
        }];
    }
  },
  navigation: {
    navPill: {
      left: {
        component: ListComponent,
        props: {
          icon: "list",
          action: "dappsList",
        },
      },
      right: {
        component: LinkComponent,
        props: {
          icon: "home",
          action: "link",
          link: "#/dashboard",
        },
      },
      actionButton: {
        component: ActionButtonComponent, // action|
        props: {
          disabled: false,
        },
      },
    },
  },
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
    tokens,
    tokenDetail,
    trustDetail,
    graph,
    sendInvite,
    profile,
    findMySafe,
  ],
};
