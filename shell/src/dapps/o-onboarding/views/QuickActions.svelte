<script>
  import Icons from "../../../shared/molecules/Icons.svelte";
  import { clickOutside } from "src/shared/functions/clickOutside.ts";
  import { createEventDispatcher } from "svelte";
  import { isMobile } from "../../../shared/functions/isMobile";
  import LinkPill from "src/shared/atoms/LinkPill.svelte";

  export let navigation = [
    {
      extern: true,
      url: "https://circles.land",
      icon: "home",
      title: "Link 1",
    },
    {
      extern: true,
      url: "https://circles.land",
      icon: "home",
      title: "Link 2",
    },
    {
      extern: true,
      url: "https://circles.land",
      icon: "home",
      title: "Link 3",
    },
    {
      extern: true,
      url: "https://circles.land",
      icon: "home",
      title: "Link 4",
    },
  ];

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

<style>

</style>
