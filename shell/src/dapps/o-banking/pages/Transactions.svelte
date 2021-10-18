<script lang="ts">
import BankingHeader from "../atoms/BankingHeader.svelte";
import { transfer } from "../processes/transfer";
import TransactionCard from "../atoms/TransactionCard.svelte";
import TopNav from "src/shared/atoms/TopNav.svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { onMount } from "svelte";
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
  limit: 100,
};
</script>

<BankingHeader runtimeDapp="{runtimeDapp}" routable="{routable}" balance="0" />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2 mb-14">
  <List
    listItemType="{ProfileEvent}"
    listItemComponent="{TransactionCard}"
    fetchQuery="{TransactionTimelineDocument}"
    fetchQueryArguments="{listArguments}"
    dataKey="events" />
</div>
