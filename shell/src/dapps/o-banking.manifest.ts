import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import Transactions from "./o-banking/pages/Transactions.svelte";
import TransactionDetail from "./o-banking/pages/TransactionDetail.svelte";
import Assets from "./o-banking/pages/Assets.svelte";
import AssetDetail from "./o-banking/pages/AssetDetail.svelte";
import Trusts from "./o-banking/pages/Trusts.svelte";
import Graph from "./o-banking/pages/Graph.svelte";
import ProfilePage from "./o-banking/molecules/Profile.svelte";
import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
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

const transactions: PageManifest = {
  isDefault: true,
  routeParts: ["transactions"],
  component: Transactions,
  title: "Transactions",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const profile: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["profile", ":id"],
  component: ProfilePage,
  hideFooter: false,
  title: "Profile",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

export const transactionDetail: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["transactions", ":_id"],
  component: TransactionDetail,
  title: "Transaction",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
  actions: [
    {
      key: "setTrust",
      label: "Trust",
      icon: "trust",
      event: (runtimeDapp: RuntimeDapp<BankingDappState>) => {
        return new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = setTrust;
            ctx.childContext = {
              data: {
                trustLimit: 100,
                safeAddress: runtimeDapp.state.currentSafeAddress,
                privateKey: localStorage.getItem("circlesKey"),
              },
            };
            return ctx;
          }
        );
      },
    },
    {
      key: "transfer",
      icon: "sendmoney",
      label: "Send Money",
      event: (runtimeDapp: RuntimeDapp<BankingDappState>) => {
        return new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = transfer;
            ctx.childContext = {
              data: {
                safeAddress: runtimeDapp.state.currentSafeAddress,
                privateKey: localStorage.getItem("circlesKey"),
              },
            };
            return ctx;
          }
        );
      },
    },
  ],
};

const transactionSend: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["transactions", "send", ":to", ":amount", ":message"],
  component: Transactions,
  title: "Transactions",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const tokens: PageManifest = {
  isDefault: false,
  routeParts: ["assets"],
  component: Assets,
  title: "Assets",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const tokenDetail: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["assets", ":symbol"],
  component: AssetDetail,
  title: "Asset",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const trusts: PageManifest = {
  isDefault: false,
  routeParts: ["trusts"],
  component: Trusts,
  title: "Trusts",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const sendInvite: PageManifest = {
  isDefault: false,
  routeParts: ["trusts", "invite", ":inviteAccountAddress"],
  isSystem: true,
  component: Trusts,
  title: "Trusts",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const trustDetail: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["trusts", ":id"],
  component: ProfilePage,
  title: "Trust",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const findMySafe: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["find-my-safe"],
  component: FindMySafe,
  hideFooter: true,
  title: "FindMySafe",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

const graph: PageManifest = {
  isDefault: false,
  routeParts: ["network"],
  component: Graph,
  title: "Network",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    },
  ],
};

export interface DappState {
  // put state here
}

export class BankingDappState {
  /**
   * The currently displayed profile (e.g. in the profile detail)
   */
  currentProfileId?: number
  /**
   * The address of the currently displayed safe (e.g. in the profile detail)
   */
  currentSafeAddress?: string
}

export const banking: DappManifest<DappState> = {
  dappId: "banking:1",
  isSingleton: true,
  dependencies: [],
  isHidden: false,
  icon: faPeopleArrows,
  title: "Banking",
  routeParts: ["banking"],
  tag: Promise.resolve("alpha"),
  isEnabled: true,
  actions: (runtimeDapp: RuntimeDapp<any>) => [
    {
      key: "setTrust",
      label: "Trust someone",
      icon: "trust",
      event: () => {
        return new RunProcess<ShellProcessContext>(
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
        );
      },
    },
    {
      key: "transfer",
      icon: "sendmoney",
      label: "Send Money",
      event: () => {
        return new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = transfer;
            ctx.childContext = {
              data: {
                safeAddress: tryGetCurrentSafe().safeAddress,
                privateKey: localStorage.getItem("circlesKey"),
              },
            };
            return ctx;
          }
        );
      },
    },
  ],
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
      initialPage: transactions,
      cancelDependencyLoading: false,
    };
  },
  pages: [
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
