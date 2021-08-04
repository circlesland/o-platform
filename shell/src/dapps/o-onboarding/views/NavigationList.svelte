<script lang="ts">
  import Icons from "../../../shared/molecules/Icons.svelte";
  import { clickOutside } from "../../../shared/functions/clickOutside.ts";
  import { createEventDispatcher } from "svelte";
  import LinkPill from "../../../shared/atoms/LinkPill.svelte";
  import {getRouteList} from "../../../shared/functions/getRouteList";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: RuntimeDapp<any>;

  let navigation = [];
  $: {
    if (runtimeDapp && routable) {
      navigation = getRouteList(runtimeDapp, runtimeDapp, routable);
    } else {
      navigation = [];
    }
  }

  const eventDispatcher = createEventDispatcher();
</script>

<div
  class="z-10 flex flex-col flex-1"
  use:clickOutside
  on:click_outside="{() => eventDispatcher('clickedOutside')}">
  <nav class="flex flex-col flex-1 p-4 mt-4 w-52"></nav>
  <div class="relative flex-shrink-0 p-4 pt-4 pb-20 space-y-2 w-52">
    {#if navigation}
      {#each navigation as navItem}
        <LinkPill
          props="{{ icon: navItem.icon, text: navItem.title, link: navItem.url, isActive: navItem.isActive }}" />
      {/each}
    {/if}
  </div>
</div>
<div
  class="fixed z-50 flex justify-center flex-shrink-0 w-12 h-12 px-3 py-4 ml-4 bg-white rounded-full cursor-pointer mobile-view bottom-6 left-72 lg:hidden"
  on:click="{() => eventDispatcher('clickedClose')}">
  <Icons icon="buttonleftarrow" />
</div>

<style>

</style>
