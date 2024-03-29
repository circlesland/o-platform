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
import Icons from "../../../shared/molecules/Icons.svelte";
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
    <!-- bg-passport-light bg-passport bg-banking bg-banking-light bg-marketplace bg-marketplace-light bg-contacts bg-contacts-light -->
    <DashboardInvitesWidget />
    <div class="flex flex-col space-y-4">
      <DashboardColorCard
        color="passport"
        link="/passport/profile"
        blobshape="60% 40% 56% 38% / 99% 50% 90% 57%"
        icon="identification"
        title="dapps.o-dashboard.pages.home.passport" />

      <DashboardColorCard
        color="banking"
        link="/banking/transactions"
        blobshape="137% 1% 119% 38% / 99% 60% 86% 73%"
        icon="banking"
        title="dapps.o-dashboard.pages.home.banking" />

      <DashboardColorCard
        color="marketplace"
        link="/marketplace/locations"
        blobshape="60% 4% 83% 88% / 99% 50% 90% 81%"
        icon="shopping-cart"
        title="dapps.o-dashboard.pages.home.market" />

      <DashboardColorCard
        color="contacts"
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
            <Icons icon="users" class="w-20 h-20 heroicon" />
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
              <Icons icon="badge-check" class="w-20 h-20 heroicon" />
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
              <Icons icon="ticket" class="w-20 h-20 heroicon" />
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
              <Icons icon="photograph" class="w-20 h-20 heroicon" />
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
