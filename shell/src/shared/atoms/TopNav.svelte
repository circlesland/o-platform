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
  <div class="fixed top-0 left-0 z-10 w-full">
    <div
      class="grid w-full grid-cols-3 p-2 pl-4 mx-auto text-white md:w-2/3 xl:w-1/2 navbar bg-primarydark "
    >
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
