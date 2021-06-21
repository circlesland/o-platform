<script lang="ts">
  import { me } from "../../../shared/stores/me";
  import { onMount } from "svelte";
  import StatsHeader from "../atoms/StatsHeader.svelte";
  import { Stats, StatsDocument } from "../../../shared/api/data/types";
  import StatsField from "../atoms/StatsField.svelte";

  const { mySafe } = require("src/dapps/o-banking/stores/safe");

  $: me;
  let isLoading: boolean = true;
  let error: Error;
  let stats: Stats;

  const init = async () => {
    try {
      const apiClient = await window.o.apiClient.client.subscribeToResult();
      const statsData = await apiClient.query({
        query: StatsDocument,
      });
      if (statsData.errors && statsData.errors.length) {
        throw new Error(
          `An error occurred while querying the stats: ${JSON.stringify(
            statsData.errors
          )}`
        );
      }
      stats = statsData.data.stats;
    } catch (e) {
      error = e;
    } finally {
      isLoading = false;
    }
  };

  onMount(init);

  const sub = window.o.events.subscribe((event) => {
    if (event.type !== "shell.refresh") {
      return;
    }
    init();
  });

  $: {
  }

</script>

<StatsHeader {stats} />
<div class="mx-4 -mt-6">
  {#if isLoading}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading stats ...</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the stats:</b>
            <pre
              style="overflow: auto">
                            {JSON.stringify(error, null, 2)}
                        </pre>
          </div>
        </div>
      </div>
    </section>
  {:else if stats}
    <section class="flex items-center justify-center mb-1 ">
      <div
        class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
      >
        <div class="text-xs font-bold text-left  ">Global stats</div>
      </div>
    </section>
    <section class="flex items-center justify-center mb-2 ">
      <div
        class="flex items-center w-full px-4 pt-5 space-x-2 bg-white rounded-sm shadow sm:space-x-6"
      >
        <div class="relative flex-grow text-left">
          <StatsField
            {stats}
            field={{
              key: "totalCitizens",
              title: "Total citizens",
            }}
          />
          <StatsField
            {stats}
            field={{
              key: "currentGoal",
              title: "Current goal",
            }}
          />
          <StatsField
            {stats}
            field={{
              key: "nextGoalAt",
              title: "Next goal at",
            }}
          />
        </div>
      </div>
    </section>
    <section class="flex items-center justify-center mb-1 ">
      <div
        class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
      >
        <div class="text-xs font-bold text-left  ">My stats</div>
      </div>
    </section>
    <section class="flex items-center justify-center mb-2 ">
      <div
        class="flex items-center w-full px-4 pt-5 space-x-2 bg-white rounded-sm shadow sm:space-x-6"
      >
        <div class="relative flex-grow text-left">
          <StatsField
            {stats}
            field={{
              key: "totalCitizens",
              title: "Total citizens",
            }}
          />
        </div>
      </div>
    </section>
  {:else}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>No stats</div>
        </div>
      </div>
    </section>
  {/if}
</div>
