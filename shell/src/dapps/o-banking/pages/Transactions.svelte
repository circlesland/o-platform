<script lang="ts">
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import { push } from "svelte-spa-router";
  import gql from "graphql-tag";
  import TransactionCard from "../atoms/TransactionCard.svelte";
  import { me } from "../../../shared/stores/me";
  import {onMount} from "svelte";

  let timestampSevenDays = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
  let transactions:any = [];


  onMount(async () => {
    load();
  });

  async function load() {
    transactions = await loadTransactions($me.circlesAddress);
    const circlesAddresses = transactions.reduce((p,c) => {
      p[c.hubTransfer.from] = c.hubTransfer.from;
      p[c.hubTransfer.to] = c.hubTransfer.to;
      return p;
    } , {});
    const profiles = await loadProfileDataForTransactions(Object.keys(circlesAddresses));
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
  }

  async function loadTransactions(circlesAddress: string) {
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

  async function loadProfileDataForTransactions(circlesAddresses:string[]) {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: gql`
              query profiles($circlesAddresses:[String!]!) {
                profiles(query:{circlesAddress:$circlesAddresses}) {
                  id
                  circlesAddress
                  firstName
                  lastName
                  dream
                  country
                  avatarUrl
                  avatarCid
                  avatarMimeType
                }
              }`,
      variables: {
        circlesAddresses: circlesAddresses
      }
    });

    console.log("All profiles in transactions list:", result.data.profiles)
    return result.data.profiles;
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
          displayName={notification.hubTransfer.to}
          direction="transactionnegative"
          amount={notification.hubTransfer.amount}
          message="WURST"
          time={notification.time}
        />
      {:else}
        <TransactionCard
          displayName={notification.hubTransfer.from}
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
