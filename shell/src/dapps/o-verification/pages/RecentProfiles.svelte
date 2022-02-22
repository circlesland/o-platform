<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { GetRecentProfilesDocument } from "../../../shared/api/data/types";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import RecentUserCard from "../atoms/RecentUserCard.svelte";
import List from "../../../shared/molecules/Lists/List.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

const listArguments = {};

console.log("LKASJDLAKSDJALSKDJASLDKJASD");
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <List
    listItemComponent="{RecentUserCard}"
    fetchQuery="{GetRecentProfilesDocument}"
    fetchQueryArguments="{listArguments}"
    selector="id"
    sortOrder="{'DESC'}"
    dataKey="recentProfiles"
    dataLimit="{500}" />
</div>
