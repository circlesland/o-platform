<script lang="ts">
import Icons from "src/shared/molecules/Icons.svelte";
import { clickOutside } from "src/shared/functions/clickOutside.ts";
import { onMount } from "svelte";
import LinkPill from "src/shared/atoms/LinkPill.svelte";
import { getRouteList } from "src/shared/functions/getRouteList";
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
        text: 'Privacy Policy',
        link: 'https://coda.io/@circlesland/terms/privacy-policy-3',
        extern: true,
        isSmall: true,
      }}" />
    <LinkPill
      props="{{
        text: 'Terms of Service',
        link: 'https://coda.io/@circlesland/terms',
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
