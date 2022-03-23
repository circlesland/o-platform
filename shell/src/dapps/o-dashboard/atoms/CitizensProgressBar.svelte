<script lang="ts">
export let previousTarget: number;
export let progressTarget: number;
export let profilesCount: number;

let progressTargetCalc: number = progressTarget - previousTarget;

$: profilesCount -= previousTarget;
</script>

<div class="w-full m-auto mt-4 xl:w-2/3">
  <div class="flex flex-row items-stretch">
    <div class="flex-grow text-sm whitespace-nowrap text-primary">
      {previousTarget} Citizens
    </div>
    <div
      class="text-sm text-light-dark justify-self-end"
      class:text-light-dark="{profilesCount < progressTargetCalc}"
      class:text-primary="{profilesCount >= progressTargetCalc}">
      {progressTarget} Citizens
    </div>
  </div>

  <progress
    class="relative w-full progress progress-primary"
    value="{profilesCount ? profilesCount : '0'}"
    max="{progressTargetCalc}"></progress>
  {#if profilesCount > 0}
    <div
      class="text-xs"
      class:hidden="{profilesCount >= progressTargetCalc}"
      style="margin-left: {(profilesCount / progressTargetCalc) * 100 - 5}%">
      {profilesCount ? profilesCount + previousTarget : ""}
    </div>
  {/if}

  <!-- style="margin-left: {(70 / 200) * 100}%" -->
  <div class="flex flex-row items-stretch">
    <div class="flex-grow text-sm whitespace-nowrap text-primary">
      Party is happening!
    </div>
    <div
      class="text-sm justify-self-end"
      class:text-light-dark="{profilesCount < progressTargetCalc}"
      class:text-primary="{profilesCount >= progressTargetCalc}">
      Next Party
    </div>
  </div>
</div>
