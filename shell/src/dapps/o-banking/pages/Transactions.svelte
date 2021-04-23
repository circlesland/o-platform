<script lang="ts">
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import { push } from "svelte-spa-router";
  import gql from "graphql-tag";
  import TransactionCard from "../atoms/TransactionCard.svelte";
  import { me } from "../../../shared/stores/me";
  import {onMount} from "svelte";
  import Web3 from "web3";
  import {ProfilesByCirclesAddressDocument} from "../data/api/types";
  import {Queries} from "../data/xdai/queries";

  let timestampSevenDays = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
  let transactions:any = [];

  onMount(async () => {
    load();
  });

  async function load() {
    transactions = await loadTransactions($me.circlesAddress);

    // Get all involved addresses
    const circlesAddresses = transactions.reduce((p,c) => {
      const from = Web3.utils.toChecksumAddress(c.hubTransfer.from);
      p[from] = true;
      const to = Web3.utils.toChecksumAddress(c.hubTransfer.to);
      p[to] = true;
      return p;
    } , {});

    const circlesAddressesArr = Object.keys(circlesAddresses);

    // Load all circles.land profiles
    const profiles = await loadProfilesBySafeAddress(circlesAddressesArr);
    const profilesLookup = profiles.reduce((p,c) => {
      p[c.circlesAddress] = c;
      return p;
    }, {});
    transactions.forEach(transaction => {
      transaction.hubTransfer.from = profilesLookup[transaction.hubTransfer.from]
        ? profilesLookup[transaction.hubTransfer.from].firstName
        : transaction.hubTransfer.from;
      transaction.hubTransfer.to = profilesLookup[transaction.hubTransfer.to]
        ? profilesLookup[transaction.hubTransfer.to].firstName
        : transaction.hubTransfer.to;
    });
    transactions = transactions;

    // Load all circles.garden profiles
    const circlesGardenProfiles = await loadCirclesGardenProfilesBySafeAddress(circlesAddressesArr);
    const circlesGardenProfilesLookup = circlesGardenProfiles.reduce((p,c) => {
      p[c.safeAddress.toLowerCase()] = c;
      return p;
    }, {});
    transactions.forEach(transaction => {
      if (Web3.utils.isAddress(transaction.hubTransfer.from)) {
        transaction.hubTransfer.from = circlesGardenProfilesLookup[transaction.hubTransfer.from]
          ? circlesGardenProfilesLookup[transaction.hubTransfer.from].username
          : transaction.hubTransfer.from;
      }
      if (Web3.utils.isAddress(transaction.hubTransfer.to)) {
        transaction.hubTransfer.to = circlesGardenProfilesLookup[transaction.hubTransfer.to]
          ? circlesGardenProfilesLookup[transaction.hubTransfer.to].username
          : transaction.hubTransfer.to;
      }
    });
    transactions = transactions;
  }

  async function loadTransactions(circlesAddress: string) {

    const token = await Queries.findCirclesTokenOfSafeAddress(circlesAddress);
    console.log("Token via web3:", token);

    const apiClient = await window.o.theGraphClient;
    const result = await apiClient.query({
      query: gql`
      query notifications($safe: String!) {
        notifications(where: { type: "HUB_TRANSFER", safe: $safe }) {
          time
          transactionHash
          hubTransfer {
            from
            to
            amount
          }
        }
      }`,
      variables: {
        safe: circlesAddress.toLowerCase()
      }
    });
    return result.data.notifications;
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

<BankingHeader />

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
      {#if $me.circlesAddress == notification.hubTransfer.from}
        <TransactionCard
          displayName={notification.hubTransfer.from}
          direction="transactionnegative"
          amount={notification.hubTransfer.amount}
          message="WURST"
          time={notification.time}
        />
      {:else}
        <TransactionCard
          displayName={notification.hubTransfer.to}
          direction="transactionpositive"
          amount={notification.hubTransfer.amount}
          message="WURST"
          time={notification.time}
        />
      {/if}
    {/each}
  {:else}
    <span>No recent activities</span>
  {/if}
</div>
