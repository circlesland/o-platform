<script lang="ts">
import BankingHeader from "../atoms/BankingHeader.svelte";
import TransactionCard from "../atoms/TransactionCard.svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {
  ProfileEvent,
  TransactionTimelineDocument,
} from "../../../shared/api/data/types";
import List from "../../../shared/molecules/Lists/List.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

$: me;

const listArguments = {
  safeAddress: $me.circlesAddress,
};
</script>

<BankingHeader runtimeDapp="{runtimeDapp}" routable="{routable}" balance="0" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <List
    listItemType="{ProfileEvent}"
    listItemComponent="{TransactionCard}"
    fetchQuery="{TransactionTimelineDocument}"
    fetchQueryArguments="{listArguments}"
    dataKey="blockchainEvents"
    dataLimit="{100}" />
</div>
