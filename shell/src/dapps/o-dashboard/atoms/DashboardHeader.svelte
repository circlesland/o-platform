<script lang="ts">
  import { onMount } from "svelte";
  import { getLastLoadedDapp, getLastLoadedPage } from "../../../loader";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;

  onMount(() => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();
  });
</script>

<!-- DASHBOARD HEADER START -->
<div
  class="h-80 flex flex-col items-stretch navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  {#if lastLoadedDapp && lastLoadedPage}
    <div class=" pl-2 ">
      <span class="text-lg font-circles"
        >{#if lastLoadedDapp.title != lastLoadedPage.title}
          {lastLoadedDapp.title} /
        {/if}{lastLoadedPage.title}</span
      >
    </div>
  {/if}
  <div class="self-center text-center mt-6 block">
    <div class="avatar">
      <div class="w-36 h-36 rounded-full ring ring-gradient1 mb-4">
        <img src="https://i.pravatar.cc/500?img=32" />
      </div>
    </div>
    <div class="">
      <strong>Hi Martin,</strong> Welcome to CirclesLAND
    </div>
    <div class="">
      <small>This is your dashboard and door into our universe.</small>
    </div>
  </div>
</div>
<!-- DASHBOARD HEADER STOP -->
