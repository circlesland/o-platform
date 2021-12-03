<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {
  VerificationsDocument
} from "../../../shared/api/data/types";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import VerificationCard from "../atoms/VerificationCard.svelte";
import List from "../../../shared/molecules/Lists/List.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

const listArguments = {};
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  <List
    listItemComponent="{VerificationCard}"
    fetchQuery="{VerificationsDocument}"
    fetchQueryArguments="{listArguments}"
    selector="createdAt"
    dataKey="verifications"
    dataLimit="{50}" />
</div>
