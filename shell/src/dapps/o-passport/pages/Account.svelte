<script lang="ts">
  import { me } from "../../../shared/stores/me";
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  $: me;
</script>

<SimpleHeader {runtimeDapp} {routable} />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">
  <ItemCard
    params="{{ edgeless: false, imageProfile: $me, title: $me ? ($me.lastName ? `${$me.firstName} ${$me.lastName}` : $me.firstName) : '', subTitle: 'Main Account holder', truncateMain: true }}">

    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl">UBI</div>
    </div>
  </ItemCard>

</div>
