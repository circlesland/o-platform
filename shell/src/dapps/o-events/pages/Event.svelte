<script lang="ts">
import "../../../shared/css/tailwind.css";
import TopNav from "src/shared/atoms/TopNav.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import { push } from "svelte-spa-router";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div class="mx-auto md:w-2/3 xl:w-1/2">
  <div class="m-4 mt-20 ">
    <section class="p-4 mb-4 dashboard-card">LASKJDALSKDJASLDKJASDLKj</section>
  </div>
</div>
