<script lang="ts">
import { onMount } from "svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { _ } from "svelte-i18n";
import LinkPill from "../atoms/LinkPill.svelte";
import { getRouteList } from "../functions/getRouteList";

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
        text: $_('common.privacyPolicy'),
        i18nKey: 'common.privacyPolicy',
        link: 'homepage/privacy',
        extern: false,
        isSmall: true,
      }}" />
    <LinkPill
      props="{{
        text: $_('common.termsOfService'),
        i18nKey: 'common.termsOfService',
        link: 'homepage/terms',
        extern: false,
        isSmall: true,
      }}" />

    {#if navigation}
      {#each navigation as navItem}
        <LinkPill
          props="{{
            icon: navItem.icon,
            text: $_(`${navItem.title}`),
            i18nKey: navItem.title,
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
