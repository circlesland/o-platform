<script lang="ts">
import { push } from "svelte-spa-router";
import { stats } from "../../../shared/stores/stats";
import ButtonContext from "../../../shared/atoms/button/buttonContext";
import Button from "../../../shared/atoms/button/Button.svelte";
import { me } from "../../../shared/stores/me";
import {Stats} from "../../../shared/api/data/types";
import Label from "../../../shared/atoms/Label.svelte";
import { _ } from "svelte-i18n";


let shareButton: ButtonContext = {
  label: "share invite link",
  color: "primary",
  style: "small",
  disableLoading: true,
  action: async () => {
    push("#/home/share");
  },
};

let _stats: Stats = {
  goals: {
    nextGoal: 0,
    lastGoal: 0,
    currentValue: 0
  },
  leaderboard: [],
  myRank: {
    rank: 0,
    redeemedInvitationsCount: 0
  },
  profilesCount: 0,
  verificationsCount: 0
};

$: {
  if ($stats) {
    _stats = $stats;
  }
}
</script>

<section class="relative p-4 mb-4 bg-white rounded-lg shadow-md dashboard-card ">

  <div class="absolute top-0 left-0 w-full text-center">
    {#if _stats.goals.nextGoal > 0}
    <progress
      class="w-full h-10 rounded-t-lg progress progress-primary"
      value="{_stats.profilesCount ? _stats.profilesCount : '0'}"
      max="{_stats.goals.nextGoal}"></progress>
    {:else}
      <div class="w-full h-10 rounded-t-lg" style="background:#081b4a"></div>
    {/if}
    <div class="absolute grid w-full grid-cols-3 px-2 text-white top-3">
      {#if _stats.goals.nextGoal > 0}
        <div class="text-sm text-left inline-flex flex-none justify-start"><div class="pr-1">{_stats.profilesCount}</div> <Label key="dapps.o-dashboard.molecules.dashboardInvitesWidget.citizens" /></div>
        <div class="w-auto -mt-1 leading-0">
          {Math.floor((100 * _stats.profilesCount) / _stats.goals.nextGoal)}%
        </div>
        <div class="-ml-2 text-sm text-right whitespace-nowrap">
          +{_stats.goals.nextGoal - _stats.profilesCount > 0 ? _stats.goals.nextGoal - _stats.profilesCount : 0} <Label key="dapps.o-dashboard.molecules.dashboardInvitesWidget.tillNextParty" />
        </div>
      {/if}
    </div>
  </div>
  {#if $me && $me.__typename === "Profile"}
    <div class="flex flex-row justify-around mt-10">
      <div class="flex flex-col self-center space-y-2 justify-items-center">
        <div class="self-center text-6xl font-heading">
          {!$stats ? ". . ." : _stats.myRank.rank}
        </div>
        <div class="text-sm text-dark-lightest"><Label key="dapps.o-dashboard.molecules.dashboardInvitesWidget.myLeaderrank" /></div>
      </div>
      <div class="flex flex-col self-center space-y-2 justify-items-center">
        <div class="self-center text-6xl cursor-pointer font-heading" on:click="{() => push('#/home/invites')}">
          {!$stats ? ". . ." : _stats.myRank.redeemedInvitationsCount}
        </div>
        <div class="text-sm text-dark-lightest"><Label key="dapps.o-dashboard.molecules.dashboardInvitesWidget.myInvites" /></div>
      </div>
    </div>
  {/if}

  {#if $me && $me.__typename === "Profile"}
    <div class="flex flex-row justify-around mt-4 mb-1 text-center">
      <Button context="{{
        label: $_("dapps.o-dashboard.molecules.dashboardInvitesWidget.leaderBoardButton"),
        color: "light",
        style: "small",
        disableLoading: true,
        action: async () => {
          push("#/home/leaderboard");
        },
      }}" />
      <Button context="{{
        label: $_("dapps.o-dashboard.molecules.dashboardInvitesWidget.invieteLinkButton"),
        color: "primary",
        style: "small",
        disableLoading: true,
        action: async () => {
          push("#/home/share");
        },
      }}" />
    </div>
  {/if}
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
