<script lang="ts">
  import Time from "svelte-time";

  export let time: number = null;
  export let relativeDaysBase: number = 7;

  let now = new Date();
  let relativeDaysAgo = now.setDate(now.getDate() - relativeDaysBase);

  function dateOlderThanSevenDays(unixTime: number) {
    return relativeDaysAgo > unixTime * 1000;
  }
</script>

{#if time}
  {#if dateOlderThanSevenDays(time)}
    <Time timestamp={new Date(time * 1000)} format="D. MMMM YYYY" />
  {:else}
    <Time relative timestamp={new Date(time * 1000)} live={true} />
  {/if}
{/if}
