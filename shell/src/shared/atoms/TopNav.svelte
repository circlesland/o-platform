<script lang="ts">
  import { onMount } from "svelte";
  import { getLastLoadedDapp, getLastLoadedPage } from "../../loader";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import {Page} from "@o-platform/o-interfaces/dist/routables/page";

  let lastLoadedPage: Page<any,any>;
  let lastLoadedDapp: DappManifest<any>;

  onMount(() => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();
  });
</script>

{#if lastLoadedDapp && lastLoadedPage}
  <div class="fixed top-0 left-0 z-10 w-full">
    <div
      class="grid w-full grid-cols-3 p-2 pl-4 mx-auto text-white navbar bg-secondary-dark "
    >
      <div class="cursor-pointer justify-self-start">
        <span class="text-lg uppercase ">
          {lastLoadedDapp.title}
        </span>
      </div>
      {#if lastLoadedDapp.title != lastLoadedPage.title}
        <div class="cursor-pointer justify-self-center">
          <span class="text-sm ">
            {lastLoadedPage.title}
          </span>
        </div>
      {/if}
    </div>
  </div>
{/if}
