<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {
  Organisation,
} from "../../../shared/api/data/types";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import OrganisationCard from "../atoms/OrganisationCard.svelte";
import List from "../../../shared/molecules/Lists/List.svelte";
import {RegionsDocument} from "../../../shared/api/data/types";

let organisations: Organisation[] = null;
let error: string | undefined = undefined;

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

const listArguments = {};
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2 mb-14">
  <List
    listItemType="{Organisation}"
    listItemComponent="{OrganisationCard}"
    fetchQuery="{RegionsDocument}"
    fetchQueryArguments="{listArguments}"
    dataKey="regions"
    dataLimit="{50}" />
</div>
