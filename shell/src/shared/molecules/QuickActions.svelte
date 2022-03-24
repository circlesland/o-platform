<script lang="ts">
  import {clickOutside} from "src/shared/functions/clickOutside.ts";
  import {createEventDispatcher, onMount} from "svelte";

  import {dapps} from "src/loader";
  import DetailActionBar from "./DetailActionBar.svelte";
  import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {JumplistItem} from "@o-platform/o-interfaces/dist/routables/jumplist";
  import ProfileSwitcherBar from "./ProfileSwitcherBar.svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: RuntimeDapp<any>;

  let categories: {
    manifest: DappManifest<any>,
    items: {
      ["action"]: JumplistItem[],
      ["profile"]: JumplistItem[],
    }
  }[] = [];

  onMount(async () => {
    const manifestsWithJumplist = dapps.filter((o) => o.jumplist);
    categories = await Promise.all(manifestsWithJumplist.map(async o => {
      const jumplistItems = await o.jumplist.items({}, runtimeDapp);
      return <{ manifest: DappManifest<any>, items: { ["action"]: JumplistItem[], ["profile"]: JumplistItem[] } }>{
        manifest: o,
        items: jumplistItems.groupBy(c => c.type ?? "action")
      };
    }));
  });

  const eventDispatcher = createEventDispatcher();
</script>

<div class="z-10 flex flex-col flex-1"
     use:clickOutside
     on:click_outside="{() => eventDispatcher('clickedOutside')}">
    <div class="relative flex-shrink-0 w-full p-6 space-y-2">
        {#each categories.filter(o => o.items['action']) as category}
            <div class="text-dark-lightest text-3xs sm:text-sm">
                {category.manifest.title}
            </div>
            <div class="">
                <DetailActionBar actions="{category.items['action'] ? category.items['action'] : []}"/>
            </div>
        {/each}
    </div>
    <hr/>
    <div class="relative flex-shrink-0 w-full p-6 space-y-2">
        {#each categories.filter(o => o.items['profile']) as category}
            <div class="">
                <ProfileSwitcherBar actions="{category.items['profile'] ? category.items['profile'] : []}"/>
            </div>
        {/each}
    </div>
</div>
