<script lang="ts">
import { clickOutside } from "src/shared/functions/clickOutside.ts";
import { createEventDispatcher, onMount } from "svelte";

import { dapps } from "src/loader";
import DetailActionBar from "./DetailActionBar.svelte";
import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { JumplistItem } from "@o-platform/o-interfaces/dist/routables/jumplist";
import ProfileSwitcherBar from "./ProfileSwitcherBar.svelte";
import LangSwitcher from "../atoms/LangSwitcher.svelte";

export let runtimeDapp: RuntimeDapp<any>;

let categories: {
  manifest: DappManifest<any>;
  items: {
    ["action"]: JumplistItem[];
    ["profile"]: JumplistItem[];
  };
}[] = [];

let actions: JumplistItem[] = [];
let profiles: JumplistItem[] = [];

let showSwitcher: boolean = false;

onMount(async () => {
  const manifestsWithJumplist = dapps.filter((o) => o.jumplist);
  categories = await Promise.all(
    manifestsWithJumplist.map(async (o) => {
      const jumplistItems = await o.jumplist.items({}, runtimeDapp);
      return <
        {
          manifest: DappManifest<any>;
          items: {
            ["action"]: JumplistItem[];
            ["profile"]: JumplistItem[];
          };
        }
      >{
        manifest: o,
        items: jumplistItems.groupBy((c) => c.type ?? "action"),
      };
    })
  );

  actions = categories.filter((o) => o.items["action"]).flatMap((o) => o.items["action"]);
  profiles = categories.filter((o) => o.items["profile"]).flatMap((o) => o.items["profile"]);
});

const eventDispatcher = createEventDispatcher();
</script>

<!-- 
<header class="p-5 pb-6 overflow-hidden text-white bg-cpurple" style="border-radius: 0 0% 85% 69% / 0% 0% 85% 83%; ">
  <div class="w-full text-center">
    <h1 class="text-3xl uppercase font-heading">Actions</h1>
  </div>
</header> -->

<header>
  <div class="h-1 m-auto mt-2 rounded-full w-14 bg-slate-500"></div>
</header>
<div class="z-10 flex flex-col flex-1" use:clickOutside on:click_outside="{() => eventDispatcher('clickedOutside')}">
  {#if showSwitcher}
    <div class="w-full p-6">
      <LangSwitcher />
    </div>
  {:else}
    <div class="w-full text-center">
      <h1 class="pt-4 text-3xl uppercase font-heading">My Profiles</h1>
    </div>

    <div class="relative flex-shrink-0 w-full pt-2 space-y-2">
      <div class="">
        <ProfileSwitcherBar
          actions="{profiles}" />
      </div>
    </div>
    <div class="w-full text-center">
      <h1 class="pt-4 text-3xl uppercase font-heading">Quick Actions</h1>
    </div>
    <div class="py-6">
      <DetailActionBar actions="{actions}" on:siwtchEvent={() => {
        showSwitcher = !showSwitcher;
      }} />
    </div>
  {/if}
</div>
