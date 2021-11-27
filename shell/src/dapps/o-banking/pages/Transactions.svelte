<script lang="ts">
import BankingHeader from "../atoms/BankingHeader.svelte";

import TransactionCard from "../atoms/TransactionCard.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { EventType} from "../../../shared/api/data/types";

import EventList from "../../../shared/molecules/Lists/EventList.svelte";
import {transactions} from "../../../shared/stores/transactions";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

</script>

<BankingHeader runtimeDapp="{runtimeDapp}" routable="{routable}" balance="0" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <EventList
    store={transactions}
    views="{{
      [EventType.CrcHubTransfer]: TransactionCard,
      [EventType.CrcMinting]: TransactionCard,
      [EventType.Erc20Transfer]: TransactionCard,
    }}" />
</div>
