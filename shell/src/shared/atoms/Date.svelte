<script lang="ts">
import Time from "svelte-time";

export let time: string = null;
export let relativeDaysBase: number = 7;

const convertedTime = new Date(Date.parse(time));
let now = new Date();

let relativeDaysAgo = now.setDate(now.getDate() - relativeDaysBase);

function dateOlderThanSevenDays(unixTime: number) {
  return relativeDaysAgo > unixTime;
}
</script>

{#if time}
  {#if dateOlderThanSevenDays(convertedTime.getTime())}
    <Time timestamp="{convertedTime}" format="DD.MM.YYYY" />
  {:else}
    <Time relative timestamp="{convertedTime}" live="{true}" />
  {/if}
{/if}
