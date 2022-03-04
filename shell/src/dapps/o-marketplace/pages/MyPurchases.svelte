<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import MyPurchaseCard from "../atoms/MyPurchaseCard.svelte";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import EventList from "../../../shared/molecules/Lists/EventList.svelte";
  import {EventType} from "../../../shared/api/data/types";
  import {myPurchases} from "../../../shared/stores/myPurchases";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">

  <EventList store={myPurchases}
             views="{{[EventType.Purchased]: MyPurchaseCard}}" />
  <!--
  {#if !$purchases}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>{$_("dapps.o-marketplace.pages.myPurchases.loadingPurchases")}</div>
        </div>
      </div>
    </section>
  {:else if $purchases && $purchases.length === 0}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>{$_("dapps.o-marketplace.pages.myPurchases.noPurchases")}</div>
        </div>
      </div>
    </section>
  {:else if $purchases && $purchases.length > 0}
  {/if}
  -->
</div>
