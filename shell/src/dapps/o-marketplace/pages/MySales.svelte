<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { mySales } from "../../../shared/stores/mySales";
import SaleCard from "../atoms/SaleCard.svelte";
import { EventType } from "../../../shared/api/data/types";
import EventList from "../../../shared/molecules/Lists/EventList.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2 ">
  <EventList store="{mySales}" views="{{ [EventType.SaleEvent]: {component: SaleCard} }}" />
</div>
