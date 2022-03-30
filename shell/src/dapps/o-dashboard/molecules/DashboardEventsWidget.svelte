<script lang="ts">
import CitizensProgressBar from "../atoms/CitizensProgressBar.svelte";
import { push } from "svelte-spa-router";

export let profilesCount: number;
</script>

<section class="p-4 mb-4 bg-white rounded-lg shadow-md dashboard-card">
  <div class="w-full text-center">
    <h1>WANT MORE PARTIES?</h1>
    <span class="text-dark-lightest">Invite your friends.</span>
  </div>
  <CitizensProgressBar
    profilesCount="{profilesCount}"
    previousTarget="{233}"
    progressTarget="{377}" />
  <div class="mt-4 mb-1 text-center">
    <button class="btn btn-primary" on:click="{() => push('/home/invites')}"
      >My Invites</button>
  </div>
</section>
