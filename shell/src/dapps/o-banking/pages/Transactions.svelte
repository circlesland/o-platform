<script lang="ts">
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import {push} from "svelte-spa-router";
  import gql from "graphql-tag";
  import Time from "svelte-time";

  import {setClient} from "svelte-apollo";
  import {me} from "../../../shared/stores/me";
  import {onMount} from "svelte";

  setClient(<any>window.o.theGraphClient);

  let timestampSevenDays = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;

  let transactions:any = [];

  $: {
    if ($me.circlesAddress) {
    }
  }

  onMount(async () => {
    load();
  });

  function loadDetailPage(path) {
    push("#/banking/transactions/" + path);
  }

  function dateOlderThanSevenDays(unixTime: number) {
    return timestampSevenDays > unixTime;
  }

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
</script>

<BankingHeader/>

<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
  {#each transactions as notification}
    <div>
      when: {notification.time}<br/>
      {#if dateOlderThanSevenDays(notification.time)}
        <Time
          timestamp={new Date(notification.time * 1000)}
          format="D. MMMM YYYY"
        />
      {:else}
        <Time relative timestamp={new Date(notification.time * 1000)}/>
        <br/>
      {/if}
      from: {notification.hubTransfer.from}<br/>
      to: {notification.hubTransfer.to}<br/>
      amount: {notification.hubTransfer.amount}
    </div>
  {/each}
</div>

<div class="mx-4 -mt-6">
  <section
    on:click|once={() => loadDetailPage("daniel/samuel/200")}
    class="flex items-center justify-center mb-2 text-circlesdarkblue"
  >
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src="/images/common/circles.png" alt="username"/>
          </div>
        </div>
      </div>

      <div class="text-left">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold">Samuel</h2>
        </div>
        <p class="text-sm mt-2">time</p>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-transactionpositive text-2xl sm:text-3xl">
          <span>200.00</span>
        </div>
        <div class="self-end mt-2 text-xs text-circleslightblue">
          9 days ago
        </div>
      </div>
    </div>
  </section>

  <section
    on:click|once={() => loadDetailPage("samuel/inga/30")}
    class="flex items-center justify-center mb-2 text-circlesdarkblue"
  >
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src="https://i.pravatar.cc/500?img=42" alt="username"/>
          </div>
        </div>
      </div>

      <div class="text-left">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold">Inga</h2>
        </div>
        <p class="text-sm mt-2">Brotschneidemaschine</p>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-transactionnegative text-2xl sm:text-3xl">
          <span>30.00</span>
        </div>
        <div class="self-end mt-2 text-xs text-circleslightblue">
          2 weeks ago
        </div>
      </div>
    </div>
  </section>

  <section
    on:click|once={() => loadDetailPage("drfranz/samuel/0.89")}
    class="flex items-center justify-center mb-2 text-circlesdarkblue"
  >
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src="https://i.pravatar.cc/500?img=12" alt="username"/>
          </div>
        </div>
      </div>

      <div class="text-left">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold">
            Dr. Franziskus McCarthy
          </h2>
        </div>
        <p class="text-sm mt-2">+-*&^#$(@*&^#%!)#(&*%$&#*(</p>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-transactionpositive text-2xl sm:text-3xl">
          <span>0.89</span>
        </div>
        <div class="self-end mt-2 text-xs text-circleslightblue">23.1.2021</div>
      </div>
    </div>
  </section>
</div>
