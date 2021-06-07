<script lang="ts">
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import {Stats} from "../../../shared/api/data/types";

  export let showBackArrow: boolean = false;
  export let stats: Stats;

  let percent: number;
  let fromColor: string = "#093181";
  let stopColor: string = "#1CD5A4";
  let toColor: string = "#093181";

  $: {
    if (stats) {
      let currentGoalSize = stats.nextGoalAt - stats.currentGoalFrom;
      percent = (stats.nextGoalAt - stats.totalCitizens) * (currentGoalSize / 100)
    }
  }
</script>

<TopNav showBackArrow={showBackArrow} />
<div class="h-24 flex flex-row w-full items-stretch justify-items-stretch  bg-gradient-to-r from-gradient1 to-gradient2 text-white">
  <div class="h-24 -mt-6 self-center flex-grow justify-self-center text-center">
    {#if percent}
      <div class="p-6 mt-6 flex"
           style="background: #093181;
                  background: -moz-linear-gradient(left, {fromColor} 0%, {stopColor} {percent}%, {stopColor} {percent}%, {toColor} 100%);
                  background: -webkit-linear-gradient(left, {fromColor} 0%, {stopColor} {percent}%, {stopColor} {percent}%, {toColor} 100%);
                  background: linear-gradient(to right, {fromColor} 0%, {stopColor} {percent}%, {stopColor} {percent}%, {toColor} 100%);">
        <div class="w-1/3 bg-green-100 text-left"><b>{stats.totalCitizens}</b></div>
        <div class="w-1/3 bg-green-200 text-center"><!--{percent.toFixed(0)} %--></div>
        <div class="w-1/3 bg-green-300 text-right"><b>+ {stats.nextGoalAt - stats.totalCitizens}</b></div>
      </div>
    {/if}
  </div>
</div>
