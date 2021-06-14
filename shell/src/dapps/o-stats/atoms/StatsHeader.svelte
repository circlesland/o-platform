<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import { Stats } from "../../../shared/api/data/types";

  export let showBackArrow: boolean = false;
  export let stats: Stats;

  let percent: number;
  let fromColor: string = "#093181";
  let stopColor: string = "#1CD5A4";
  let toColor: string = "#093181";

  $: {
    if (stats) {
      let currentGoalSize = stats.nextGoalAt - stats.currentGoalFrom;
      percent =
        (stats.nextGoalAt - stats.totalCitizens) * (currentGoalSize / 100);
    }
  }

</script>

<TopNav {showBackArrow} />
<div
  class="flex flex-row items-stretch w-full h-24 text-white justify-items-stretch bg-primarydark"
>
  <div class="self-center flex-grow h-24 -mt-6 text-center justify-self-center">
    {#if percent}
      <div
        class="flex p-6 mt-6"
        style="background: #093181;
                  background: -moz-linear-gradient(left, {fromColor} 0%, {stopColor} {percent}%, {stopColor} {percent}%, {toColor} 100%);
                  background: -webkit-linear-gradient(left, {fromColor} 0%, {stopColor} {percent}%, {stopColor} {percent}%, {toColor} 100%);
                  background: linear-gradient(to right, {fromColor} 0%, {stopColor} {percent}%, {stopColor} {percent}%, {toColor} 100%);"
      >
        <div class="w-1/3 text-left bg-green-100">
          <b>{stats.totalCitizens}</b>
        </div>
        <div class="w-1/3 text-center bg-green-200">
          <!--{percent.toFixed(0)} %-->
        </div>
        <div class="w-1/3 text-right bg-green-300">
          <b>+ {stats.nextGoalAt - stats.totalCitizens}</b>
        </div>
      </div>
    {/if}
  </div>
</div>
