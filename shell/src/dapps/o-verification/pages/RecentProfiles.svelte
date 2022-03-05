<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import RecentUserCard from "../atoms/RecentUserCard.svelte";
  import EventList from "../../../shared/molecules/Lists/EventList.svelte";
  import {EventType} from "../../../shared/api/data/types";
  import {newUsers} from "../../../shared/stores/newUsers";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  const listArguments = {};
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <EventList store={newUsers}
             views="{{[EventType.NewUser]: RecentUserCard}}" />
</div>
