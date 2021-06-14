<script lang="ts">
  import { onMount } from "svelte";
  import { getLastLoadedDapp, getLastLoadedPage } from "../../loader";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;

  onMount(() => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();
  });

</script>

{#if lastLoadedDapp && lastLoadedPage}
  <div
    class="navbar flex-row  justify-between  bg-primarydark text-white sticky -top-0.5 z-10"
  >
    <div class="grid w-full grid-cols-3 pt-0 pl-2 ">
      <div
        class="cursor-pointer justify-self-start"
        on:click|once={() => history.back()}
      >
        <span class="text-lg uppercase font-circles">
          {lastLoadedDapp.title}
        </span>
      </div>
      {#if lastLoadedDapp.title != lastLoadedPage.title}
        <div class="cursor-pointer justify-self-center">
          <span class="text-sm font-circles">
            {lastLoadedPage.title}
          </span>
        </div>
      {/if}
    </div>
  </div>
{/if}
