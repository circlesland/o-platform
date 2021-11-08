<script lang="ts">
import BankingHeader from "../atoms/BankingHeader.svelte";
//import TransactionCard from "../atoms/TransactionCard.svelte";
import TransactionCard2 from "../atoms/TransactionCard2.svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { EventType, StreamDocument } from "../../../shared/api/data/types";

import List from "../../../shared/molecules/Lists/EventList.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

$: me;
</script>

<BankingHeader runtimeDapp="{runtimeDapp}" routable="{routable}" balance="0" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <List
    limit="{25}"
    queryArguments="{{
      safeAddress: $me.circlesAddress,
      types: [
        EventType.CrcHubTransfer,
        EventType.CrcMinting
      ],
    }}"
    views="{{
      [EventType.CrcHubTransfer]: TransactionCard2,
      [EventType.CrcMinting]: TransactionCard2,
    }}" />
</div>
