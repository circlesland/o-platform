<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";

import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { me } from "../../../shared/stores/me";
import { KeyManager } from "../data/keyManager";
import AccountCard from "../atoms/AccountCard.svelte";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let keyManager: KeyManager | null = null;

async function init() {
  const km = new KeyManager($me.circlesAddress);
  await km.load();
  keyManager = km;
}

$: {
  if ($me && $me.circlesAddress) {
    init();
  }
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mt-8 mb-20 md:w-2/3 xl:w-1/2">
  <ItemCard
    params="{{
      edgeless: false,
      imageProfile: $me,
      noShadow: true,
      title: $me.displayName,
      subTitle: `${window.o.i18n('dapps.o-passport.pages.account.subTitle')}`,
      truncateMain: true,
    }}">
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl">UBI</div>
    </div>
  </ItemCard>

  {#if keyManager}
    {#each Object.values(keyManager.eoas).sort((a, b) => a.address.localeCompare(b.address)) as key}
      <AccountCard key="{key}" />
    {/each}
  {/if}
</div>
