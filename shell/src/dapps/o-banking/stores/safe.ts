import {readable} from "svelte/store";
import {Queries, Safe} from "../data/circles/queries";
import {Erc20Token} from "@o-platform/o-circles/dist/token/erc20Token";
import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
import {BN} from "ethereumjs-util";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {me, Profile} from "../../../shared/stores/me";
import {ProfilesByCirclesAddressDocument} from "../data/api/types";
import Web3 from "web3";

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
  loading: true,
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

export const mySafe = readable<Safe|null>(null, (set) => {
  set(emptySafe);

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

  async function load(event: PlatformEvent & { profile: Profile }) {
    loading = true;
    try {
      if (!RpcGateway.get().utils.isAddress(event.profile.circlesAddress ?? "")) {
        localStorage.removeItem("safe");
        set(emptySafe);
        return;
      }

      let safe: Safe = {
        safeAddress: event.profile.circlesAddress
      };

      safe = await Queries.addOwnToken(safe);
      console.log("Token via web3:", JSON.stringify(safe, null, 2));
      set(safe);

      safe = await Queries.addHubTransfers(safe, safe.token.firstBlock);
      const hubTransferCount = safe.transfers.rows.length;
      console.log(`Added ${hubTransferCount} hub transfers.`)
      set(safe);
      augmentProfiles(safe);

      safe = await Queries.addContacts(safe);
      console.log(`Added ${Object.keys(safe.trustRelations.trusting).length + Object.keys(safe.trustRelations.trustedBy).length} trust relations.`)
      set(safe);

      safe = await Queries.addAcceptedTokens(safe);
      console.log(`Added ${Object.keys(safe.acceptedTokens.tokens).length} accepted tokens.`)
      set(safe);

      safe = await Queries.addTokenBalances(safe);
      safe.token.balance = (await new Erc20Token(RpcGateway.get(), safe.token.tokenAddress).getBalanceOf(safe.safeAddress)).toString();
      console.log(`Added balances to ${Object.keys(safe.acceptedTokens.tokens).length} tokens.`)
      set(safe);

      const totalBalance = Object.keys(safe.acceptedTokens.tokens).reduce((p: BN, c: string) => p.add(new BN(safe.acceptedTokens.tokens[c].balance)), new BN("0")).add(new BN(safe.token.balance));
      const totalBalanceStr = totalBalance.toString();
      safe.balance = parseFloat(RpcGateway.get().utils.fromWei(totalBalanceStr, "ether")).toFixed(2);
      set(safe);

      safe = await Queries.addDirectTransfers(safe);
      console.log(`Added ${safe.transfers.rows.length - hubTransferCount} direct transfers.`)
      set(safe);
      localStorage.setItem("safe", JSON.stringify(safe));
      await augmentProfiles(safe);
      safe.loading = false;
      set(safe);
    } catch (e) {
      localStorage.removeItem("safe");
      set(emptySafe);
      throw e;
    } finally {
      loading = false;
    }
  }

  const cachedSafeJson = localStorage.getItem("safe");
  if (cachedSafeJson) {
    try {
      const safe = JSON.parse(cachedSafeJson);
      set(safe);
      augmentProfiles(safe).then(() => {
        set(safe);
      });
      return;
    } catch (e) {
      console.error("An error occurred while parsing the cached safe:", e);
      localStorage.removeItem("safe");
      set(emptySafe);
    }
  }

  const unsubscribe = me.subscribe(async profileOrNull => {
      if (profileOrNull && RpcGateway.get().utils.isAddress(profileOrNull.circlesAddress ?? "")) {
        await load({
          type: "shell.authenticated",
          profile: profileOrNull
        });
      } else {
        localStorage.removeItem("safe");
        set(emptySafe);
        return;
      }
    });

  return function stop() {
    unsubscribe();
  };
});
