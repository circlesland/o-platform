<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import RedeemedInvitationCard from "../atoms/RedeemedInvitationCard.svelte";
  import EventList from "../../../shared/molecules/Lists/EventList.svelte";
  import {EventType} from "../../../shared/api/data/types";
  import {redeemedInvitations} from "../../../shared/stores/redeemedInvitations";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  const listArguments = {};
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <EventList store={redeemedInvitations}
             views="{{[EventType.InvitationRedeemed]: {component: RedeemedInvitationCard}}}" />
</div>
