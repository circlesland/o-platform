<script lang="ts">
import CitizensProgressBar from "../atoms/CitizensProgressBar.svelte";
import { push } from "svelte-spa-router";
import {stats} from "../../../shared/stores/stats";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";

</script>

<section class="p-4 mb-4 bg-white rounded-lg shadow-md dashboard-card">
  <div class="w-full text-center">
    <h1><Label key="dapps.o-dashboard.molecules.dashboardEventsWidget.wantMoreParties" /></h1>
    <span class="text-dark-lightest"><Label key="dapps.o-dashboard.molecules.dashboardEventsWidget.inviteYourFriends" /></span>
  </div>
  {#if $stats}
    <CitizensProgressBar
      profilesCount="{$stats.goals.currentValue}"
      previousTarget="{$stats.goals.lastGoal}"
      progressTarget="{$stats.goals.nextGoal}" />
  {:else}
    <CitizensProgressBar />
  {/if}
  <div class="mt-4 mb-1 text-center">
    <button class="btn btn-primary" on:click="{() => push('/home/invites')}"
      >My Invites</button>
  </div>
</section>
