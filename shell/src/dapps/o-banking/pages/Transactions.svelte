<script lang="ts">
import BankingHeader from "../atoms/BankingHeader.svelte";

import TransactionCard from "../atoms/TransactionCard.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { EventType } from "../../../shared/api/data/types";

import EventList from "../../../shared/molecules/Lists/EventList.svelte";
import { myTransactions } from "../../../shared/stores/myTransactions";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<BankingHeader runtimeDapp="{runtimeDapp}" routable="{routable}" balance="0" />

<div class="px-4 mx-auto mt-8 mb-20 md:w-2/3 xl:w-1/2">
  <EventList
    store="{myTransactions}"
    views="{{
      [EventType.CrcHubTransfer]: { component: TransactionCard },
      [EventType.CrcMinting]: { component: TransactionCard },
      [EventType.Erc20Transfer]: { component: TransactionCard },
    }}" />
</div>
