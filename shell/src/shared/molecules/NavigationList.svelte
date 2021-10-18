<script lang="ts">
import Icons from "src/shared/molecules/Icons.svelte";
import { clickOutside } from "src/shared/functions/clickOutside.ts";
import { onMount } from "svelte";
import LinkPill from "src/shared/atoms/LinkPill.svelte";
import { getRouteList } from "src/shared/functions/getRouteList";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { isMobile } from "../functions/isMobile";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: RuntimeDapp<any>;

let navigation = [];

onMount(() => {
  window.o.events.subscribe((event: any) => {
    if (event.type !== "shell.routeChanged") return;

    runtimeDapp = event.runtimeDapp;
    routable = event.routable;
  });
});

$: {
  if (runtimeDapp && routable) {
    navigation = getRouteList(runtimeDapp, runtimeDapp, routable);
  } else {
    navigation = [];
  }
}
//  use:clickOutside
// on:click_outside="{e => {
//   if (isMobile()) {
//     window.o.publishEvent({ type: 'shell.closeNavigation' });
//     e.stopImmediatePropagation();
//   }
// }}"
</script>

<div class="z-10 flex flex-col flex-1">
  <nav class="flex flex-col flex-1 p-4 mt-4 w-52"></nav>
  <div class="relative flex-shrink-0 pt-4 pb-12 space-y-2 w-52">
    <LinkPill
      props="{{
        text: 'Legal Notice',
        link: '/#/homepage/tos',
        extern: true,
        isSmall: true,
      }}" />
    <LinkPill
      props="{{
        text: 'Terms & Privacy',
        link: '/#/homepage/tos',
        extern: true,
        isSmall: true,
      }}" />
    <LinkPill
      props="{{
        text: 'Help & Support',
        link: '/#/homepage/tos',
        extern: true,
        isSmall: true,
      }}" />
    {#if navigation}
      {#each navigation as navItem}
        <LinkPill
          props="{{
            icon: navItem.icon,
            text: navItem.title,
            link: navItem.url,
            isActive: navItem.isActive,
          }}" />
      {/each}
    {/if}
  </div>
</div>

<style>
</style>
