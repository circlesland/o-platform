import {
  faPeopleArrows,
} from "@fortawesome/free-solid-svg-icons";
import Transactions from "./o-banking/pages/Transactions.svelte";
import TransactionDetail from "./o-banking/pages/TransactionDetail.svelte";
import Tokens from "./o-banking/pages/Tokens.svelte";
import TokenDetail from "./o-banking/pages/TokenDetail.svelte";
import Trusts from "./o-banking/pages/Trusts.svelte";
import TrustDetail from "./o-banking/pages/TrustDetail.svelte";
import Graph from "./o-banking/pages/Graph.svelte";
import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
import { shellProcess, ShellProcessContext } from "../shared/processes/shellProcess";
import LoadingIndicator from "../shared/atoms/LoadingIndicator.svelte";
import Success from "../shared/atoms/Success.svelte";
import { getUbi } from "./o-banking/processes/getUbi";
import { hubSignup } from "./o-banking/processes/hubSignup";
import { setTrust } from "./o-banking/processes/setTrust";
import { transfer } from "./o-banking/processes/transfer";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {me, Profile} from "../shared/stores/me";
import {Queries, Safe} from "./o-banking/data/circles/queries";
import Web3 from "web3";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {Erc20Token} from "@o-platform/o-circles/dist/token/erc20Token";
import {BN} from "ethereumjs-util";
import {DelayedTrigger} from "@o-platform/o-utils/dist/delayedTrigger";
import {Subscription} from "rxjs";
import {ProfilesByCirclesAddressDocument} from "./o-banking/data/api/types";

let loading = false;
let profile:Profile|undefined;
let blockChainEventsSubscription:Subscription|null;

export const emptySafe:Safe = {
  safeAddress: "0x00",
  balance: "0",
  ui: {
    loadingPercent: -1,
    loadingText: "No safe connected",
    error: undefined
  },
  transfers: {
    firstBlock:0,
    lastBlock:0,
    rows:[]
  },
  token: {
    _id: "",
    tokenAddress: "0x00",
    balance: "0",
    tokenOwner: "0x00",
    firstBlock: 0
  },
  acceptedTokens: {
    tokens: {
    },
    lastBlock:0,
    firstBlock:0
  },
  lastBlock:0,
  firstBlock:0,
  trustRelations: {
    trustedBy:{},
    trusting:{},
    lastBlock:0,
    firstBlock:0
  },
  ownerAddress:"0x00"
};

let _currentSafe:Safe|null = emptySafe;
export function tryGetCurrentSafe() {
  return _currentSafe;
}

async function loadProfilesBySafeAddress(circlesAddresses:string[]) {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query: ProfilesByCirclesAddressDocument,
    variables: {
      circlesAddresses: circlesAddresses
    }
  });

  console.log("All profiles in transactions list:", result.data.profiles)
  return result.data.profiles;
}

async function loadCirclesGardenProfilesBySafeAddress(circlesAddresses:string[]) {
  const baseUrl = `https://api.circles.garden/api/users/`;
  if (circlesAddresses.length == 0) {
    return [];
  }
  let query = circlesAddresses.reduce((p,c) => p + `address[]=${c}&`, "");
  query = query.substr(0, query.length - 1);
  console.log("Querying the following profiles from the circles garden api:", query);

  const result = await fetch(`${baseUrl}?${query}`);
  const resultJson = await result.json();
  console.log(resultJson);

  return resultJson.data;
}

async function init() {
  const subscription = window.o.events.subscribe((event: PlatformEvent & {
    profile: Profile
  }) => {
    if (event.type == "shell.loggedOut") {
      localStorage.removeItem("me");
      localStorage.removeItem("safe");
      profile = null;
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: null
      });
      _currentSafe = null;
      return;
    }
  });

  async function augmentProfiles(safe: Safe) {
    // Get all involved addresses
    const circlesAddresses = safe.transfers.rows.filter(o => Web3.utils.isAddress(o.to) && Web3.utils.isAddress(o.from)).reduce((p, c) => {
      const from = Web3.utils.toChecksumAddress(c.from);
      p[from] = true;
      const to = Web3.utils.toChecksumAddress(c.to);
      p[to] = true;
      return p;
    }, {});

    const circlesAddressesArr = Object.keys(circlesAddresses);

    // Load all circles.land profiles
    const profiles = await loadProfilesBySafeAddress(circlesAddressesArr);
    const profilesLookup = profiles.reduce((p, c) => {
      p[Web3.utils.toChecksumAddress(c.circlesAddress)] = c;
      return p;
    }, {});
    safe.transfers.rows.forEach(transaction => {
      transaction.fromProfile = profilesLookup[transaction.from]
        ? {
          displayName: `${profilesLookup[transaction.from].firstName ?? ""} ${profilesLookup[transaction.from].lastName ?? ""}`,
          avatarUrl: profilesLookup[transaction.from].avatarUrl
        }
        : undefined;
      transaction.toProfile = profilesLookup[transaction.to]
        ? {
          displayName: `${profilesLookup[transaction.to].firstName ?? ""} ${profilesLookup[transaction.to].lastName ?? ""}`,
          avatarUrl: profilesLookup[transaction.to].avatarUrl
        }
        : undefined;
    });
    window.o.publishEvent(<any>{
      type: "shell.refresh",
      dapp: "banking:1",
      data: safe
    });
    _currentSafe = safe;

    // Load all circles.garden profiles
    const circlesGardenProfiles = await loadCirclesGardenProfilesBySafeAddress(circlesAddressesArr);
    const circlesGardenProfilesLookup = circlesGardenProfiles.reduce((p, c) => {
      p[c.safeAddress] = c;
      return p;
    }, {});

    safe.transfers.rows.forEach(transaction => {
      if (!transaction.fromProfile) {
        transaction.fromProfile = circlesGardenProfilesLookup[transaction.from]
          ? {
            displayName: circlesGardenProfilesLookup[transaction.from].username,
            avatarUrl: circlesGardenProfilesLookup[transaction.from].avatarUrl
          }
          : {
            displayName: transaction.from,
            avatarUrl: ""
          };
      }
      if (!transaction.toProfile) {
        transaction.toProfile = circlesGardenProfilesLookup[transaction.to]
          ? {
            displayName: circlesGardenProfilesLookup[transaction.to].username,
            avatarUrl: circlesGardenProfilesLookup[transaction.to].avatarUrl
          }
          : {
            displayName: transaction.to,
            avatarUrl: ""
          };
      }
    });

    window.o.publishEvent(<any>{
      type: "shell.refresh",
      dapp: "banking:1",
      data: safe
    });
    _currentSafe = safe;
  }

  async function load(profile: Profile, cachedSafe?:Safe, cancel?:(e) => void, tokenList?:string[]) : Promise<Safe> {
    loading = true;
    try {
      if (!RpcGateway.get().utils.isAddress(profile.circlesAddress ?? "")) {
        localStorage.removeItem("safe");
        window.o.publishEvent(<any>{
          type: "shell.refresh",
          dapp: "banking:1",
          data: emptySafe
        });
        _currentSafe = emptySafe;
        return;
      }

      let safe: Safe = cachedSafe ?? {
        safeAddress: profile.circlesAddress,
        ui: {
          loadingPercent: 0
        }
      };

      let _watchLoadingPercent = safe.ui?.loadingPercent;
      const timeoutHandle = setInterval(() => {
        if (safe?.ui?.loadingPercent === null || safe?.ui?.loadingPercent === undefined) {
          return;
        }
        if (safe.ui?.loadingPercent && safe.ui?.loadingPercent == _watchLoadingPercent) {
          clearInterval(timeoutHandle);
          if (cancel) {
            cancel(new Error("slow_provider"));
          }
        } else {
          _watchLoadingPercent = safe.ui?.loadingPercent;
        }
      }, 5000);

      safe = await Queries.addOwnToken(safe);
      console.log(new Date().getTime() +": "+ "Token via web3:", JSON.stringify(safe, null, 2));

      safe.ui.loadingText = "Loading hub transfers ..";
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: safe
      });
      _currentSafe = safe;

      safe = await Queries.addHubTransfers(safe, safe.token.firstBlock);
      const hubTransferCount = safe.transfers.rows.length;
      console.log(new Date().getTime() +": "+ `Added ${hubTransferCount} hub transfers.`)
      safe.ui.loadingPercent = 5;
      safe.ui.loadingText = "Loading trust connections ..";
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: safe
      });
      _currentSafe = safe;
      augmentProfiles(safe);

      safe = await Queries.addContacts(safe);
      console.log(new Date().getTime() +": "+ `Added ${Object.keys(safe.trustRelations.trusting).length + Object.keys(safe.trustRelations.trustedBy).length} trust relations.`)
      safe.ui.loadingPercent = 18;
      safe.ui.loadingText = "" +
        "Loading accepted tokens ..";
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: safe
      });
      _currentSafe = safe;

      safe = await Queries.addAcceptedTokens(safe);
      console.log(new Date().getTime() +": "+ `Added ${Object.keys(safe.acceptedTokens.tokens).length} accepted tokens.`)
      safe.ui.loadingPercent = 22;
      safe.ui.loadingText = "Loading balances ..";
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: safe
      });
      _currentSafe = safe;

      safe = await Queries.addTokenBalances(safe);
      safe.token.balance = (await new Erc20Token(RpcGateway.get(), safe.token.tokenAddress).getBalanceOf(safe.safeAddress)).toString();
      console.log(new Date().getTime() +": "+ `Added balances to ${Object.keys(safe.acceptedTokens.tokens).length} tokens.`)
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: safe
      });
      _currentSafe = safe;

      const totalBalance = Object.keys(safe.acceptedTokens.tokens).reduce((p: BN, c: string) => p.add(new BN(safe.acceptedTokens.tokens[c].balance)), new BN("0")).add(new BN(safe.token.balance));
      const totalBalanceStr = totalBalance.toString();
      safe.balance = parseFloat(RpcGateway.get().utils.fromWei(totalBalanceStr, "ether")).toFixed(2);
      safe.ui.loadingPercent = 26;
      safe.ui.loadingText = "Loading direct transfers ..";
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: safe
      });
      _currentSafe = safe;

      const lastProgress = safe.ui.loadingPercent;
      const remainingPercents = 100 - lastProgress;
      safe = await Queries.addDirectTransfers(safe, undefined, progress => {
        safe.ui.loadingPercent = lastProgress + (remainingPercents / progress.count) * progress.current;
        window.o.publishEvent(<any>{
          type: "shell.refresh",
          dapp: "banking:1",
          data: safe
        });
        _currentSafe = safe;
      }, tokenList);
      console.log(new Date().getTime() +": "+ `Added ${safe.transfers.rows.length - hubTransferCount} direct transfers.`)
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: safe
      });
      _currentSafe = safe;

      subscription?.unsubscribe();
      safe.ui.loadingPercent = undefined;
      safe.ui.loadingText = undefined;
      clearInterval(timeoutHandle);
      localStorage.setItem("safe", JSON.stringify(safe));
      await augmentProfiles(safe);
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: safe
      });
      _currentSafe = safe;

      let onEventUpdateTrigger = new DelayedTrigger(500, async (token:string) => {
        const safe = await update(() => {}, [token]);
        window.o.publishEvent(<any>{
          type: "shell.refresh",
          dapp: "banking:1",
          data: safe
        });
        _currentSafe = safe;
      });
      blockChainEventsSubscription = Queries.tokenEvents(safe).subscribe((event:any) => {
        console.log("NEW EVENT:", event);
        onEventUpdateTrigger.trigger(event.token);
      });

      return safe;
    } catch (e) {
      localStorage.removeItem("safe");
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: emptySafe
      });
      _currentSafe = emptySafe;
      throw e;
    } finally {
      loading = false;
    }
    return undefined;
  }

  async function tryRestoreCache() {
    const cachedSafeJson = localStorage.getItem("safe");
    if (!cachedSafeJson) {
      return;
    } else {
      try {
        const safe = JSON.parse(cachedSafeJson);
        window.o.publishEvent(<any>{
          type: "shell.refresh",
          dapp: "banking:1",
          data: safe
        });
        _currentSafe = safe;
        await augmentProfiles(safe);
        window.o.publishEvent(<any>{
          type: "shell.refresh",
          dapp: "banking:1",
          data: safe
        });
        _currentSafe = safe;
        return safe;
      } catch (e) {
        console.error("An error occurred while restoring or updating the cached safe:", e);
        localStorage.removeItem("safe");
        window.o.publishEvent(<any>{
          type: "shell.refresh",
          dapp: "banking:1",
          data: emptySafe
        });
        _currentSafe = emptySafe;
        return undefined;
      }
    }
  }

  async function update(cancel:(e:Error) => void, tokenList?:string[]) : Promise<Safe> {
    if (!profile) {
      return;
    }
    let safe = await tryRestoreCache();
    if (safe) {
      // Update the cached safe
      safe = await load(profile, safe, cancel, tokenList);
    } else {
      // Load a completely new safe
      safe = await load(profile, undefined, cancel, tokenList);
    }
    return safe;
  }

  const unsubscribe = me.subscribe(async profileOrNull => {
    profile = profileOrNull;
    let cancel:Error|undefined;
    if (profileOrNull && RpcGateway.get().utils.isAddress(profileOrNull.circlesAddress ?? "")) {
      for(let i = 0; i < RpcGateway.gateways.length; i++) {
        await update(e => cancel = e);
        if (cancel && cancel.message == "slow_provider") {
          continue;
        } else {
          return;
        }
      }
    } else {
      localStorage.removeItem("safe");
      window.o.publishEvent(<any>{
        type: "shell.refresh",
        dapp: "banking:1",
        data: emptySafe
      });
      _currentSafe = emptySafe;
      return;
    }
  });

  update(() => {});

  return function stop() {
    if (unsubscribe) {
      unsubscribe();
    }
    if (blockChainEventsSubscription) {
      blockChainEventsSubscription.unsubscribe();
    }
  };
}

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
    }
  ]
};
const transactionDetail: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["transactions", ":from", ":to", ":blockNo"],
  component: TransactionDetail,
  title: "TransactionDetail",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const tokens: PageManifest = {
  isDefault: false,
  routeParts: ["tokens"],
  component: Tokens,
  title: "Tokens",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};
const tokenDetail: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["tokens", ":symbol"],
  component: TokenDetail,
  title: "TokenDetail",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
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
    }
  ]
};

const sendInvite:PageManifest = {
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
    }
  ]
}

const trustDetail: PageManifest = {
  isDefault: false,
  isSystem: true,
  routeParts: ["trusts", ":trustPartner"],
  component: TrustDetail,
  title: "TrustDetail",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
};

const graph: PageManifest = {
  isDefault: false,
  routeParts: ["graph"],
  component: Graph,
  title: "Graph",
  available: [
    (detail) => {
      // Can navigate to?
      // Sure!
      return true;
    }
  ]
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
  actions: [{
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
            },
            dirtyFlags: {},
            environment: {
              errorView: Error,
              progressView: LoadingIndicator,
              successView: Success,
            },
          };
          return ctx;
        });
    }
  }, {
    key: "hubSignup",
    label: "Signup at Circles Hub",
    event: (runtimeDapp: RuntimeDapp<any>) => {
      return new RunProcess<ShellProcessContext>(
        shellProcess,
        true,
        async (ctx) => {
          ctx.childProcessDefinition = hubSignup;
          ctx.childContext = {
            data: {
            },
            dirtyFlags: {},
            environment: {
              errorView: Error,
              progressView: LoadingIndicator,
              successView: Success,
            },
          };
          return ctx;
        });
    }
  }, {
    key: "setTrust",
    label: "Set Trust",
    event: (runtimeDapp: RuntimeDapp<any>) => {
      return new RunProcess<ShellProcessContext>(
        shellProcess,
        true,
        async (ctx) => {
          ctx.childProcessDefinition = setTrust;
          ctx.childContext = {
            data: {
            },
            dirtyFlags: {},
            environment: {
              errorView: Error,
              progressView: LoadingIndicator,
              successView: Success,
            },
          };
          return ctx;
        });
    }
  }, {
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
            },
            dirtyFlags: {},
            environment: {
              errorView: Error,
              progressView: LoadingIndicator,
              successView: Success,
            },
          };
          return ctx;
        });
    }
  }],
  initialize: async (stack, runtimeDapp) => {
    // Do init stuff here
    await init()
    return {
      initialPage: transactions,
      cancelDependencyLoading: false
    };
  },
  pages: [transactions, transactionDetail, tokens, tokenDetail, trusts, trustDetail, graph, sendInvite]
};