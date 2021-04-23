import {readable} from "svelte/store";
import {Queries, Safe} from "../data/circles/queries";
import {Erc20Token} from "@o-platform/o-circles/dist/token/erc20Token";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {BN} from "ethereumjs-util";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {me, Profile} from "../../../shared/stores/me";
import {ProfilesByCirclesAddressDocument} from "../data/api/types";
import Web3 from "web3";
import {Subscription} from "rxjs";
import {DelayedTrigger} from "@o-platform/o-utils/dist/delayedTrigger";

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

const emptySafe:Safe = {
  safeAddress: "0x00",
  balance: "0",
  loadingPercent: -1,
  loadingText: "No safe connected",
  transfers: {
    firstBlock:0,
    lastBlock:0,
    rows:[]
  },
  token: {
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
  error: undefined,
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

let loading = false;
let profile:Profile|undefined;
let blockChainEventsSubscription:Subscription|null;

export const mySafe = readable<Safe|null>(null, (set) => {
  set(emptySafe);

  const subscription = window.o.events.subscribe((event: PlatformEvent & {
    profile: Profile
  }) => {
    if (event.type == "shell.loggedOut") {
      localStorage.removeItem("me");
      localStorage.removeItem("safe");
      profile = null;
      set(null);
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
      if (transaction.direction === "in" && profilesLookup[transaction.from]) {
        transaction.objectAvatarUrl = profilesLookup[transaction.from].avatarUrl;
      } else if (profilesLookup[transaction.to]) {
        transaction.objectAvatarUrl = profilesLookup[transaction.to].avatarUrl;
      }
      transaction.from = profilesLookup[transaction.from]
        ? profilesLookup[transaction.from].firstName
        : transaction.from;
      transaction.to = profilesLookup[transaction.to]
        ? profilesLookup[transaction.to].firstName
        : transaction.to;
    });
    set(safe);

    // Load all circles.garden profiles
    const circlesGardenProfiles = await loadCirclesGardenProfilesBySafeAddress(circlesAddressesArr);
    const circlesGardenProfilesLookup = circlesGardenProfiles.reduce((p, c) => {
      p[c.safeAddress] = c;
      return p;
    }, {});
    safe.transfers.rows.forEach(transaction => {
      if (Web3.utils.isAddress(transaction.from)) {
        if (transaction.direction === "in" && profilesLookup[transaction.from]) {
          transaction.objectAvatarUrl = profilesLookup[transaction.from].avatarUrl;
        }
        transaction.from = circlesGardenProfilesLookup[transaction.from]
          ? circlesGardenProfilesLookup[transaction.from].username
          : transaction.from;
      }
      if (Web3.utils.isAddress(transaction.to)) {
        if (profilesLookup[transaction.to]) {
          transaction.objectAvatarUrl = profilesLookup[transaction.to].avatarUrl;
        }
        transaction.to = circlesGardenProfilesLookup[transaction.to]
          ? circlesGardenProfilesLookup[transaction.to].username
          : transaction.to;
      }
    });

    console.log(safe);
  }

  async function load(profile: Profile, cachedSafe?:Safe, cancel?:(e) => void, tokenList?:string[]) : Promise<Safe> {
    loading = true;
    try {
      if (!RpcGateway.get().utils.isAddress(profile.circlesAddress ?? "")) {
        localStorage.removeItem("safe");
        set(emptySafe);
        return;
      }

      let safe: Safe = cachedSafe ?? {
        safeAddress: profile.circlesAddress,
        loadingPercent: 0
      };

      let _watchLoadingPercent = safe.loadingPercent;
      const timeoutHandle = setInterval(() => {
        if (safe?.loadingPercent === null || safe?.loadingPercent === undefined) {
          return;
        }
        if (safe.loadingPercent && safe.loadingPercent == _watchLoadingPercent) {
          clearInterval(timeoutHandle);
          if (cancel) {
            cancel(new Error("slow_provider"));
          }
        } else {
          _watchLoadingPercent = safe.loadingPercent;
        }
      }, 5000);

      safe = await Queries.addOwnToken(safe);
      console.log(new Date().getTime() +": "+ "Token via web3:", JSON.stringify(safe, null, 2));

      safe.loadingText = "Loading hub transfers ..";
      set(safe);

      safe = await Queries.addHubTransfers(safe, safe.token.firstBlock);
      const hubTransferCount = safe.transfers.rows.length;
      console.log(new Date().getTime() +": "+ `Added ${hubTransferCount} hub transfers.`)
      safe.loadingPercent = 5;
      safe.loadingText = "Loading trust connections ..";
      set(safe);
      augmentProfiles(safe);

      safe = await Queries.addContacts(safe);
      console.log(new Date().getTime() +": "+ `Added ${Object.keys(safe.trustRelations.trusting).length + Object.keys(safe.trustRelations.trustedBy).length} trust relations.`)
      safe.loadingPercent = 18;
      safe.loadingText = "" +
        "Loading accepted tokens ..";
      set(safe);

      safe = await Queries.addAcceptedTokens(safe);
      console.log(new Date().getTime() +": "+ `Added ${Object.keys(safe.acceptedTokens.tokens).length} accepted tokens.`)
      safe.loadingPercent = 22;
      safe.loadingText = "Loading balances ..";
      set(safe);

      safe = await Queries.addTokenBalances(safe);
      safe.token.balance = (await new Erc20Token(RpcGateway.get(), safe.token.tokenAddress).getBalanceOf(safe.safeAddress)).toString();
      console.log(new Date().getTime() +": "+ `Added balances to ${Object.keys(safe.acceptedTokens.tokens).length} tokens.`)
      set(safe);

      const totalBalance = Object.keys(safe.acceptedTokens.tokens).reduce((p: BN, c: string) => p.add(new BN(safe.acceptedTokens.tokens[c].balance)), new BN("0")).add(new BN(safe.token.balance));
      const totalBalanceStr = totalBalance.toString();
      safe.balance = parseFloat(RpcGateway.get().utils.fromWei(totalBalanceStr, "ether")).toFixed(2);
      safe.loadingPercent = 26;
      safe.loadingText = "Loading direct transfers ..";
      set(safe);

      const lastProgress = safe.loadingPercent;
      const remainingPercents = 100 - lastProgress;
      safe = await Queries.addDirectTransfers(safe, undefined, progress => {
        safe.loadingPercent = lastProgress + (remainingPercents / progress.count) * progress.current;
        set(safe);
      }, tokenList);
      console.log(new Date().getTime() +": "+ `Added ${safe.transfers.rows.length - hubTransferCount} direct transfers.`)
      set(safe);

      subscription?.unsubscribe();
      safe.loadingPercent = undefined;
      safe.loadingText = undefined;
      clearInterval(timeoutHandle);
      localStorage.setItem("safe", JSON.stringify(safe));
      await augmentProfiles(safe);
      set(safe);

      let onEventUpdateTrigger = new DelayedTrigger(500, async (token:string) => {
        await update(() => {}, [token]);
      });
      blockChainEventsSubscription = Queries.tokenEvents(safe).subscribe((event:any) => {
        console.log("NEW EVENT:", event);
        onEventUpdateTrigger.trigger(event.token);
      });

      return safe;
    } catch (e) {
      localStorage.removeItem("safe");
      set(emptySafe);
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
        set(safe);
        await augmentProfiles(safe);
        set(safe);
        return safe;
      } catch (e) {
        console.error("An error occurred while restoring or updating the cached safe:", e);
        localStorage.removeItem("safe");
        set(emptySafe);
        return undefined;
      }
    }
  }

  async function update(cancel:(e:Error) => void, tokenList?:string[]) {
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
    augmentProfiles(safe).then(() => {
      set(safe);
    });
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
        set(emptySafe);
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
});
