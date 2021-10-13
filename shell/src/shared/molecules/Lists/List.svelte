<script lang="ts">
  /*

params: 
  Data source action
  List Element component
  
  


*/
  import { onMount } from "svelte";

  import Lazy from "src/shared/molecules/Lazy/Lazy.svelte";
  import { component_subscribe } from "svelte/internal";

  export let listComponent = {
    component: null,
    componentContext: null,
    onFocus: null,
    onBlur: null,
  };
  export let dataSource;

  const onload = node => {
    console.log("on load");

    /*
  
    - fill 'entries' from Call to dataSource with offset param

    */
  };

  onMount(async () => {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const timeline = await apiClient.query({
      query: TransactionTimelineDocument,
      variables: {
        safeAddress: $me.circlesAddress, //this.safeAddress,

        // fromBlock: 16471696
      },
    });
    if (timeline.errors) {
      error = `Couldn't load the transaction history for the following reasons: ${JSON.stringify(
        timeline.errors
      )}`;
    }
    entries = timeline.data.events;
  });
</script>

{#each entries as transfer, i}
  <Lazy
    height="{80}"
    offset="{0}"
    {onload}
    fadeOption="{{ delay: 500, duration: 1000 }}">
    {#if i === 0}
      <svelte:component
        this="{listComponent.component}"
        context="{listComponent.componentContext}"
        on:focus="{listComponent.onFocus}"
        on:blur="{listComponent.onBlur}" />
    {/if}
  </Lazy>
{/each}
