import { faPeopleArrows } from "@fortawesome/free-solid-svg-icons";
import Transactions from "./o-banking/pages/Transactions.svelte";
import TransactionDetail from "./o-banking/pages/TransactionDetail.svelte";
import Assets from "./o-banking/pages/Assets.svelte";
import AssetDetail from "./o-banking/pages/AssetDetail.svelte";
import Trusts from "./o-banking/pages/Trusts.svelte";
import ProfilePage from "./o-banking/pages/Profile.svelte";
import Graph from "./o-banking/pages/Graph.svelte";
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
import {Profile} from "./o-banking/data/api/types";

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

const transactionDetail: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["transactions", ":_id"],
  component: TransactionDetail,
  title: "TransactionDetail",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
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
  title: "TokenDetail",
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
  title: "TrustDetail",
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
  actions: [
    /*{
      key: "getUbi",
      label: "Get UBI",
      event: (runtimeDapp: RuntimeDapp<any>) => {
        return new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = getUbi;
            ctx.childContext = {
              data: {
                safeAddress: tryGetCurrentSafe()?.safeAddress,
                privateKey: localStorage.getItem("circlesKey"),
              },
            };
            return ctx;
          }
        );
      },
    },
    {
      key: "hubSignup",
      label: "Signup at Circles Hub",
      event: (runtimeDapp: RuntimeDapp<any>) => {
        return new RunProcess<ShellProcessContext>(
          shellProcess,
          true,
          async (ctx) => {
            ctx.childProcessDefinition = hubSignup;
            return ctx;
          }
        );
      },
    },*/
    {
      key: "setTrust",
      label: "Trust someone",
      event: (runtimeDapp: RuntimeDapp<any>) => {
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
      label: "Send Money",
      event: (runtimeDapp: RuntimeDapp<any>) => {
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
