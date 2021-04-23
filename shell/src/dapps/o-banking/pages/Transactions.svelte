<script lang="ts">
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import { push } from "svelte-spa-router";
  import TransactionCard from "../atoms/TransactionCard.svelte";
  import { me } from "../../../shared/stores/me";
  import {onMount} from "svelte";
  import Web3 from "web3";
  import {ProfilesByCirclesAddressDocument} from "../data/api/types";
  import {Queries, Safe} from "../data/circles/queries";
  import {BN} from "ethereumjs-util";
  import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
  import {Erc20Token} from "@o-platform/o-circles/dist/token/erc20Token";

  let timestampSevenDays = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
  let transactions:any = [];
  let balance:string = "0";

  onMount(async () => {
    load();
  });

  async function load() {
    transactions = await loadTransactions($me.circlesAddress);

    // Get all involved addresses
    const circlesAddresses = transactions.reduce((p,c) => {
      const from = Web3.utils.toChecksumAddress(c.from);
      p[from] = true;
      const to = Web3.utils.toChecksumAddress(c.to);
      p[to] = true;
      return p;
    } , {});

    const circlesAddressesArr = Object.keys(circlesAddresses);

    // Load all circles.land profiles
    const profiles = await loadProfilesBySafeAddress(circlesAddressesArr);
    const profilesLookup = profiles.reduce((p,c) => {
      p[Web3.utils.toChecksumAddress(c.circlesAddress)] = c;
      return p;
    }, {});
    transactions.forEach(transaction => {
      transaction.from = profilesLookup[transaction.from]
        ? profilesLookup[transaction.from].firstName
        : transaction.from;
      transaction.to = profilesLookup[transaction.to]
        ? profilesLookup[transaction.to].firstName
        : transaction.to;
    });
    transactions = transactions;

    // Load all circles.garden profiles
    const circlesGardenProfiles = await loadCirclesGardenProfilesBySafeAddress(circlesAddressesArr);
    const circlesGardenProfilesLookup = circlesGardenProfiles.reduce((p,c) => {
      p[c.safeAddress] = c;
      return p;
    }, {});
    transactions.forEach(transaction => {
      if (Web3.utils.isAddress(transaction.from)) {
        transaction.from = circlesGardenProfilesLookup[transaction.from]
          ? circlesGardenProfilesLookup[transaction.from].username
          : transaction.from;
      }
      if (Web3.utils.isAddress(transaction.to)) {
        transaction.to = circlesGardenProfilesLookup[transaction.to]
          ? circlesGardenProfilesLookup[transaction.to].username
          : transaction.to;
      }
    });
    transactions = transactions;
  }

  async function loadTransactions(circlesAddress: string) {

    let safe:Safe = {
      safeAddress: circlesAddress
    };

    safe = await Queries.addOwnToken(safe);
    console.log("Token via web3:", JSON.stringify(safe, null, 2));

    safe = await Queries.addHubTransfers(safe, safe.token.firstBlock);
    const hubTransferCount = safe.transfers.rows.length;
    console.log(`Added ${hubTransferCount} hub transfers.`)

    safe = await Queries.addContacts(safe);
    console.log(`Added ${Object.keys(safe.trustRelations.trusting).length + Object.keys(safe.trustRelations.trustedBy).length} trust relations.`)

    safe = await Queries.addAcceptedTokens(safe);
    console.log(`Added ${Object.keys(safe.acceptedTokens.tokens).length} accepted tokens.`)

    safe = await Queries.addTokenBalances(safe);
    safe.token.balance = (await new Erc20Token(RpcGateway.get(), safe.token.tokenAddress).getBalanceOf(safe.safeAddress)).toString();
    console.log(`Added balances to ${Object.keys(safe.acceptedTokens.tokens).length} tokens.`)

    const totalBalance = Object.keys(safe.acceptedTokens.tokens).reduce((p:BN, c:string) => p.add(new BN(safe.acceptedTokens.tokens[c].balance)), new BN("0")).add(new BN(safe.token.balance));
    const totalBalanceStr = totalBalance.toString();
    balance = parseFloat(RpcGateway.get().utils.fromWei(totalBalanceStr, "ether")).toFixed(2);

    safe = await Queries.addDirectTransfers(safe);
    console.log(`Added ${safe.transfers.rows.length - hubTransferCount} direct transfers.`)

    console.log(safe);

    return safe.transfers.rows;
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
    let query = circlesAddresses.reduce((p,c) => p + `address[]=${c}&`, "");
    query = query.substr(0, query.length - 1);
    console.log("Querying the following profiles from the circles garden api:", query);

    const result = await fetch(`${baseUrl}?${query}`);
    const resultJson = await result.json();
    console.log(resultJson);

    return resultJson.data;
  }

  function loadDetailPage(path) {
    push("#/banking/transactions/" + path);
  }

  function dateOlderThanSevenDays(unixTime: number) {
    return timestampSevenDays > unixTime;
  }
</script>

<BankingHeader balance={balance} />

<div class="mx-4 -mt-6">
  {#if transactions.loading}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>Loading Transactions...</div>
        </div>
      </div>
    </section>
  {:else if transactions.error}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
            <br />{transactions.error.message}
          </div>
        </div>
      </div>
    </section>
  {:else if transactions.length > 0}
    {#each transactions as notification}
      {#if $me.circlesAddress == notification.from}
        <TransactionCard
          displayName={notification.from}
          direction="transactionnegative"
          amount={notification.amount}
          message="WURST"
          time={notification.time}
        />
      {:else}
        <TransactionCard
          displayName={notification.to}
          direction="transactionpositive"
          amount={notification.amount}
          message="WURST"
          time={notification.time}
        />
      {/if}
    {/each}
  {:else}
    <span>No recent activities</span>
  {/if}
</div>
