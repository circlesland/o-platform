<script lang="ts">
import CitizensProgressBar from "../atoms/CitizensProgressBar.svelte";
import { push } from "svelte-spa-router";
import ButtonGroup from "../../../shared/molecules/ButtonGroup/ButtonGroup.svelte";
import { stats } from "../../../shared/stores/stats";
import ButtonContext from "../../../shared/atoms/button/buttonContext";
import Button from "../../../shared/atoms/button/Button.svelte";

let rankButton: ButtonContext = {
  label: "leaderboard",
  color: "light",
  style: "small",
  action: async () => {
    push("#/home/leaderboard");
  },
};
let leaderboardButton: ButtonContext = {
  label: "share invite link",
  color: "primary",
  style: "small",
  action: async () => {
    push("#/home/invites");
  },
};
</script>

<section class="relative p-4 mb-4 bg-white rounded-lg shadow-md dashboard-card ">
  {#if $stats}
    <div class="absolute top-0 left-0 w-full text-center">
      <progress
        class="w-full h-10 rounded-t-lg progress progress-primary"
        value="{$stats.profilesCount ? $stats.profilesCount : '0'}"
        max="{$stats.goals.nextGoal}"></progress>
      <div class="absolute grid w-full grid-cols-3 px-2 text-white top-3">
        <div class="text-sm text-left">{$stats.profilesCount} Citizens</div>

        <div class="w-auto -mt-1 leading-0">
          {Math.floor((100 * $stats.profilesCount) / $stats.goals.nextGoal)}%
        </div>
        <div class="-ml-2 text-sm text-right whitespace-nowrap">
          +{$stats.goals.nextGoal - $stats.profilesCount > 0 ? $stats.goals.nextGoal - $stats.profilesCount : 0} till next
          party
        </div>
      </div>
    </div>

    <div class="flex flex-row justify-around mt-10">
      <div class="flex flex-col self-center space-y-2 justify-items-center">
        <div class="self-center text-6xl font-heading">
          {$stats.myRank.rank}
        </div>
        <div class="text-sm text-dark-lightest">My leaderrank</div>
      </div>
      <div class="flex flex-col self-center space-y-2 justify-items-center">
        <div class="self-center text-6xl font-heading">
          {$stats.myRank.redeemedInvitationsCount}
        </div>
        <div class="text-sm text-dark-lightest">My invites</div>
      </div>
    </div>
  {/if}
  <div class="flex flex-row justify-around mt-4 mb-1 text-center">
    <Button context="{rankButton}" />
    <Button context="{leaderboardButton}" />
  </div>
</section>

<style>
progress {
  border: 0;
  /* background: #081b4a; */
  background: linear-gradient(to right, #1dd6a4, #081b4a 4%);
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0;
}

progress::-moz-progress-bar {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;

  background: linear-gradient(to right, #1dd6a4, #41c7f1);
}

progress::-webkit-progress-bar {
  /* background: #081b4a; */
  background: linear-gradient(to right, #1dd6a4, #081b4a 4%);
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 0;
}

progress::-webkit-progress-value {
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0;
  border-top-right-radius: 100px;
  border-bottom-right-radius: 100px;
  background: linear-gradient(to right, #1dd6a4, #41c7f1);
}
</style>
