<script lang="ts">
import { me } from "../../../shared/stores/me";
import { onMount } from "svelte";
import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { StatsDocument } from "../../../shared/api/data/types";

import { _ } from "svelte-i18n";
import TopNav from "../../../shared/atoms/TopNav.svelte";
import PageHeader from "../../../shared/atoms/PageHeader.svelte";
import UserImage from "../../../shared/atoms/UserImage.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let statsResult: any;
let leaderboard: any[];
let first: any;

const init = async () => {
  const pk = sessionStorage.getItem("circlesKey");

  const sessionInfo = await me.getSessionInfo();

  statsResult = await fetchStats();
  leaderboard = statsResult.data.stats.leaderboard;
  first = leaderboard.shift();
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

<TopNav
  runtimeDapp="{runtimeDapp}"
  routable="{routable}"
  headerString="Leaderboard" />
{#if leaderboard && first}
  <PageHeader heightClass="h-72">
    <div class="self-center block mt-2 text-center">
      <div class="relative mb-2">
        <UserImage
          profile="{first.createdByProfile}"
          size="{36}"
          profileLink="{true}" />
        <div
          class="absolute top-0 flex items-center content-center w-10 h-10 bg-white rounded-full left-1 cardborder">
          <div
            class="self-center w-full -mb-1 -ml-1 text-2xl text-center text-dark font-enso">
            <span class="text-xs">#</span>1
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-4xl cursor-pointer font-heading">
          {first.createdByProfile.displayName}
        </h2>
      </div>
    </div>

    {#if first.createdByProfile.city}
      <div class="mt-1 text-sm text-center cursor-pointer">
        {first.inviteCount} Citizen{first.inviteCount > 1 ? "s" : ""} invited
      </div>
    {/if}
  </PageHeader>
{/if}
<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  {#if leaderboard}
    <div class="flex flex-col space-y-4">
      {#each leaderboard as entry, i}
        <section class="cursor-pointer ">
          <div
            class="flex items-center w-full pb-2 space-x-2 bg-white rounded-lg shadow-md cardborder">
            <div class="flex-col flex-grow">
              <div
                class="flex flex-row items-center justify-between px-3 text-left"
                on:click="{() =>
                  push(`#/contacts/${entry.createdByProfile.circlesAddress}`)}">
                <div class="flex flex-row flex-grow min-w-0 mt-2 space-x-2">
                  <div
                    class="self-center px-2 pt-2 text-5xl text-center w-14 text-dark font-enso"
                    class:pl-0="{i + 2 >= 10}">
                    <span class="text-sm">#</span>{i + 2}
                  </div>
                  <div class="relative inline-flex self-center">
                    <UserImage
                      profile="{entry.createdByProfile}"
                      size="{20}"
                      gradientRing="{false}" />
                    <!-- <div
                      class="absolute flex items-center content-center w-8 h-8 bg-white rounded-full shadow-sm -top-1 -left-2 cardborder ">
                      <div
                        class="self-center w-full -mb-1 -ml-1 text-xl text-center text-dark font-enso">
                        <span class="text-xs">#</span>{i + 2}
                      </div>
                    </div> -->
                  </div>
                  <div class="flex flex-col self-center justify-items-start">
                    <h2
                      class="inline overflow-hidden text-base text-lg text-left overflow-ellipsis">
                      {entry.createdByProfile.displayName}
                    </h2>
                    <div class="flex flex-row text-left">
                      <div class="flex-grow leading-none">
                        <span class="inline-block text-sm">
                          {entry.inviteCount} Citizen{entry.inviteCount > 1
                            ? "s"
                            : ""} invited
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      {/each}
    </div>
  {/if}
</div>
