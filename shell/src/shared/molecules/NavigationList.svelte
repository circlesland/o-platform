<script lang="ts">
import { onMount } from "svelte";
import LinkPill from "../atoms/LinkPill.svelte";
import { getRouteList } from "../functions/getRouteList";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";

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
</script>

<div class="z-10 flex flex-col flex-1">
  <nav class="flex flex-col flex-1 w-auto p-4 mt-4"></nav>
  <div class="relative flex-shrink-0 w-auto pt-4 pb-12 space-y-2">
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
            extern: navItem.extern,
            isActive: navItem.isActive,
          }}" />
      {/each}
    {/if}
  </div>
</div>

<style>
</style>
