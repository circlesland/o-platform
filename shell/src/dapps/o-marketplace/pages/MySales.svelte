<script lang="ts">
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {mySales} from "../../../shared/stores/mySales";
  import SaleCard from "../atoms/SaleCard.svelte";
  import {EventType} from "../../../shared/api/data/types";
  import EventList from "../../../shared/molecules/Lists/EventList.svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <EventList store={mySales}
             views="{{[EventType.SaleEvent]: SaleCard}}" />
  <!--
  {#if !sales}
    <section class="flex items-center justify-center mb-2 ">
      <div
        class="flex items-center w-full p-4 space-x-2 bg-white rounded-lg shadow-md ">
        <div class="flex flex-col items-start">
          <div>{$_("dapps.o-marketplace.pages.mySales.loadingSales")}</div>
        </div>
      </div>
    </section>
  {:else if sales && sales.length === 0}
    <section class="flex items-center justify-center mb-2 ">
      <div
        class="flex items-center w-full p-4 space-x-2 bg-white rounded-lg shadow-md ">
        <div class="flex flex-col items-start">
          <div>{$_("dapps.o-marketplace.pages.mySales.noSales")}</div>
        </div>
      </div>
    </section>
  {:else if sales && sales.length > 0}
    <EventList store={mySales}
               views="{{[EventType.SaleEvent]: SaleCard}}" />
  {/if}
-->
</div>