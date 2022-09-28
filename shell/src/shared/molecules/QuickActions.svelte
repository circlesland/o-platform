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

<div class="z-10 flex flex-col flex-1" use:clickOutside on:click_outside="{() => eventDispatcher('clickedOutside')}">
  {#if showSwitcher}
    <div class="relative w-full p-6 space-y-2 bg-gray-200">
      <LangSwitcher />
    </div>
  {:else}
    <div class="relative flex-shrink-0 w-full p-6 space-y-2">
      <div class="">
        <ProfileSwitcherBar
          actions="{profiles}"
          on:siwtchEvent="{() => {
            showSwitcher = !showSwitcher;
          }}" />
      </div>
    </div>
    <hr />
    <div class="py-6">
      <DetailActionBar actions="{actions}" />
    </div>
  {/if}
</div>
