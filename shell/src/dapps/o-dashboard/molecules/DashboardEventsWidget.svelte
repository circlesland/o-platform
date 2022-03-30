<script lang="ts">
import CitizensProgressBar from "../atoms/CitizensProgressBar.svelte";
import { push } from "svelte-spa-router";
import {onMount} from "svelte";
import {ApiClient} from "../../../shared/apiConnection";
import {
  Profile,
  ProfilesDocument,
  ProfilesQueryVariables,
  Stats, StatsDocument,
  StatsQueryVariables
} from "../../../shared/api/data/types";

export let stats: Stats = {
  profilesCount: 0,
  verificationsCount: 0,
  leaderboard: [],
  goals: {
    currentValue: 0,
    lastGoal: 0,
    nextGoal: 0
  }
};

onMount(async () => {
  stats = await ApiClient.query<Stats, StatsQueryVariables>(StatsDocument,{});
});
</script>

<section class="p-4 mb-4 bg-white rounded-lg shadow-md dashboard-card">
  <div class="w-full text-center">
    <h1>WANT MORE PARTIES?</h1>
    <span class="text-dark-lightest">Invite your friends.</span>
  </div>
  {#if stats.goals.currentValue > 0}
    <CitizensProgressBar
      profilesCount="{stats.goals.currentValue}"
      previousTarget="{stats.goals.lastGoal}"
      progressTarget="{stats.goals.nextGoal}" />
  {/if}
  <div class="mt-4 mb-1 text-center">
    <button class="btn btn-primary" on:click="{() => push('/home/invites')}"
      >My Invites</button>
  </div>
</section>
