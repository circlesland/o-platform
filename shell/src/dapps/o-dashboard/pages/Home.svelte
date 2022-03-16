<script lang="ts">
import { me } from "../../../shared/stores/me";
import { onMount } from "svelte";
import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {
  Capability,
  CapabilityType,
  StatsDocument,
} from "../../../shared/api/data/types";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";
import { Environment } from "../../../shared/environment";
import { _ } from "svelte-i18n";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let capabilities: Capability[] | undefined = [];

$: me;

let disableBanking: boolean = false;
let canVerify: boolean = false;

let showInviteButton = false;
let progressTarget: number = 89;
let progressTargetDisplay: number = 232;
let profilesCount: number;
let statsResult: any;

const init = async () => {
  const pk = sessionStorage.getItem("circlesKey");
  disableBanking = !pk;

  const sessionInfo = await me.getSessionInfo();
  capabilities = sessionInfo.capabilities;
  canVerify =
    capabilities &&
    capabilities.find((o) => o.type == CapabilityType.Verify) &&
    Environment.allowVerify;

  statsResult = await fetchStats();
  profilesCount = statsResult.data.stats.profilesCount;
  profilesCount -= 143;
};

onMount(init);

function loadLink(link, external = false) {
  if (external) {
    window.open(link, "_blank").focus();
  } else {
    push(link);
  }
}

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
  <div class="m-4 mb-40 -mt-2">
    <section class="p-4 mb-4 bg-white rounded-lg shadow-md dashboard-card">
      <div class="w-full text-center">
        <h1>WANT MORE PARTIES?</h1>
        <span class="text-dark-lightest">Invite your friends.</span>
      </div>
      <div class="w-full mt-4">
        <!-- <div class="z-50 w-full pt-1 bg-white progressnav ">
          <div class="flex flex-row items-stretch w-full h-10 mb-2 bg-white">
            <div
              class="relative flex-grow h-2 mt-8 border-b-2 border-r-2 w-42 border-primary">
              <span class="absolute text-sm tracking-wider -right-4 bottom-2"
                >100 Citizens</span>
            </div>
            <div class="flex-grow h-2 mt-8 border-b-2 w-42 border-primary">
            </div>
            <div class="flex-grow h-2 mt-8 border-b-2 w-42 border-light">
              <span class="relative w-2 h-2 dot right-1"></span>
            </div>
            <div
              class="relative flex-grow h-2 mt-8 border-b-2 border-l-2 w-42 border-light">
              <span
                class="absolute text-sm tracking-wider text-light bottom-2 -left-4">
                200 Citizens</span>
            </div>
          </div>
        </div> -->

        {#if profilesCount}
          <div class="flex flex-row items-stretch">
            <div class="flex-grow text-sm whitespace-nowrap text-primary">
              143 Citizens
            </div>
            <div
              class="text-sm text-light-dark justify-self-end"
              class:text-light-dark="{profilesCount < progressTarget}"
              class:text-primary="{profilesCount >= progressTarget}">
              {progressTargetDisplay} Citizens
            </div>
          </div>

          <progress
            class="relative w-full progress progress-primary"
            value="{profilesCount ? profilesCount : '0'}"
            max="{progressTarget}"></progress>
          <div
            class="text-xs"
            class:hidden="{profilesCount >= progressTarget}"
            style="margin-left: {(profilesCount / progressTarget) * 100 - 5}%">
            {profilesCount ? profilesCount + 143 : "0"}
          </div>

          <!-- style="margin-left: {(70 / 200) * 100}%" -->
          <div class="flex flex-row items-stretch">
            <div class="flex-grow text-sm whitespace-nowrap text-primary">
              Party: Alte Utting
            </div>
            <div
              class="text-sm justify-self-end"
              class:text-light-dark="{profilesCount < progressTarget}"
              class:text-primary="{profilesCount >= progressTarget}">
              Next Party
            </div>
          </div>
        {/if}
      </div>
    </section>
    <div
      class="grid grid-cols-2 gap-4 text-base auto-rows-fr dashboard-grid lg:grid-cols-3">
      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
        on:click="{() => loadLink('/passport/profile')}">
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
          <div class="pt-2 text-primary">
            <Icons icon="dashpassport" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">
            {$_("dapps.o-dashboard.pages.home.passport")}
          </div>
        </div>
      </section>
      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
        on:click="{() => loadLink('/contacts')}">
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
          <div class="pt-2 text-primary">
            <Icons icon="dashfriends" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">
            {$_("dapps.o-dashboard.pages.home.contacts")}
          </div>
        </div>
      </section>
      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
        on:click="{() => loadLink('/contacts/chat')}">
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
          <div class="pt-2 text-primary">
            <Icons icon="dashchat" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">
            {$_("dapps.o-dashboard.pages.home.chat")}
          </div>
        </div>
      </section>
      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
        on:click="{() => loadLink('/banking/transactions')}">
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
          <div class="pt-2 text-primary">
            <Icons icon="dashbanking" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">
            {$_("dapps.o-dashboard.pages.home.banking")}
          </div>
        </div>
      </section>
      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
        on:click="{() => loadLink('/marketplace/locations')}">
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
          <div class="pt-2 text-primary">
            <Icons icon="dashmarket" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">
            {$_("dapps.o-dashboard.pages.home.market")}
          </div>
        </div>
      </section>
      {#if canVerify}
        <section
          class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
          on:click="{() => loadLink('/verification/verifications')}">
          <div
            class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
            <div class="pt-2 text-primary">
              <Icons icon="check" size="{12}" />
            </div>
            <div class="mt-4 text-3xl font-heading text-dark">
              {$_("dapps.o-dashboard.pages.home.verified")}
            </div>
          </div>
        </section>
      {/if}
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
