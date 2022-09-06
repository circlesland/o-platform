<script lang="ts">
import { me } from "../../../shared/stores/me";
import { onMount } from "svelte";

import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {
  AggregatesDocument,
  AggregateType,
  Capability,
  CapabilityType,
  Erc721Token,
  ProfileAggregate,
  QueryAggregatesArgs,
  StatsDocument,
} from "../../../shared/api/data/types";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { Environment } from "../../../shared/environment";
import Label from "../../../shared/atoms/Label.svelte";
import DashboardInvitesWidget from "../molecules/DashboardInvitesWidget.svelte";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import LangSwitcher from "../../../shared/atoms/LangSwitcher.svelte";
import { ApiClient } from "../../../shared/apiConnection";
import DashboardColorCard from "../atoms/DashboardColorCard.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let capabilities: Capability[] | undefined = [];

$: me;

let disableBanking: boolean = false;
let canVerify: boolean = false;
let hasTickets: boolean = false;
let balances: Erc721Token[] = [];
let profilesCount: number;
let statsResult: any;

const init = async () => {
  const pk = sessionStorage.getItem("circlesKey");
  disableBanking = !pk;

  const sessionInfo = await me.getSessionInfo();
  capabilities = sessionInfo.capabilities;
  canVerify = capabilities && capabilities.find((o) => o.type == CapabilityType.Verify) && Environment.allowVerify;
  hasTickets = capabilities && !!capabilities.find((o) => o.type == CapabilityType.Tickets);

  statsResult = await fetchStats();
  profilesCount = statsResult.data.stats.profilesCount;

  // GET NFTS to decide if we display the NFTs tile //
  const aggregates = await ApiClient.query<ProfileAggregate[], QueryAggregatesArgs>(AggregatesDocument, {
    types: [AggregateType.Erc721Tokens],
    safeAddress: $me.circlesAddress,
  });

  const erc721Balances: ProfileAggregate = aggregates.find((o) => o.type == AggregateType.Erc721Tokens);
  if (!erc721Balances || erc721Balances.payload.__typename !== AggregateType.Erc721Tokens) {
    throw new Error(`Couldn't find the Erc721Tokens in the query result.`);
  }

  balances = erc721Balances.payload.balances;
};

onMount(init);

async function fetchStats() {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.query({
    query: StatsDocument,
  });
  if (result.errors) {
    throw new Error(`Couldn't load stats': ${JSON.stringify(result.errors)}`);
  }

  return result;
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div class="mx-auto md:w-2/3 xl:w-1/2">
  <div class="m-4 mb-40 ">
    <!--<LangSwitcher />-->
    <!-- bg-identity-light bg-identity bg-banking bg-banking-light bg-market bg-market-light bg-contact bg-contact-light -->
    <DashboardInvitesWidget />
    <div class="flex flex-col space-y-4">
      <DashboardColorCard
        color="identity"
        link="/passport/profile"
        blobshape="60% 40% 56% 38% / 99% 50% 90% 57%"
        icon="identification"
        title="dapps.o-dashboard.pages.home.passport" />

      <DashboardColorCard
        color="banking"
        link="/banking/transactions"
        blobshape="137% 1% 119% 38% / 99% 60% 86% 73%"
        icon="cash"
        title="dapps.o-dashboard.pages.home.banking" />

      <DashboardColorCard
        color="market"
        link="/marketplace/locations"
        blobshape="60% 4% 83% 88% / 99% 50% 90% 81%"
        icon="shopping-cart"
        title="dapps.o-dashboard.pages.home.market" />

      <DashboardColorCard
        color="contact"
        link="/contacts/chat"
        blobshape="175% 0% 92% 93% / 110% 32% 110% 81%"
        icon="users"
        title="dapps.o-dashboard.pages.home.contacts" />
      <!-- 
      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
        on:click="{() => loadLink('/contacts')}">
        <div class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
          <div class="pt-2 text-primary">
            <Icon name="users" class="w-20 h-20 heroicon" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">
            <Label key="dapps.o-dashboard.pages.home.contacts" />
          </div>
        </div>
      </section>
      
       -->

      <!-- {#if canVerify}
        <section
          class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
          on:click="{() => loadLink('/verification/verifications')}">
          <div class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
            <div class="pt-2 text-primary">
              <Icon name="badge-check" class="w-20 h-20 heroicon" />
            </div>
            <div class="mt-4 text-3xl font-heading text-dark">
              <Label key="dapps.o-dashboard.pages.home.verified" />
            </div>
          </div>
        </section>
      {/if} -->
      <!-- {#if hasTickets}
        <section
          class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
          on:click="{() => loadLink('/marketplace/my-tickets')}">
          <div class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
            <div class="pt-2 text-primary">
              <Icon name="ticket" class="w-20 h-20 heroicon" />
            </div>
            <div class="mt-4 text-3xl font-heading text-dark">
              <Label key="dapps.o-dashboard.pages.home.tickets" />
            </div>
          </div>
        </section>
      {/if}
      {#if balances.length}
        <section
          class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
          on:click="{() => loadLink('/gallery/nfts')}">
          <div class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
            <div class="pt-2 text-primary">
              <Icon name="photograph" class="w-20 h-20 heroicon" />
            </div>
            <div class="mt-4 text-3xl font-heading text-dark">
              <Label key="dapps.o-dashboard.pages.home.gallery" />
            </div>
          </div>
        </section>
      {/if} -->
    </div>
  </div>
</div>

<style>
.dashboard-grid {
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  grid-auto-rows: 1fr;
}
@media (min-width: 640px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, minmax(8rem, 1fr));
  }
}

.dashboard-grid::before {
  content: "";
  width: 0;
  padding-bottom: 100%;
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}

.dashboard-grid > *:first-child {
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}
</style>
