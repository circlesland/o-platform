<script lang="ts">
import { me } from "../../../shared/stores/me";
import TopNav from "src/shared/atoms/TopNav.svelte";
import PageHeader from "src/shared/atoms/PageHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";
$: me;

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
let name: string = "";

$: {
  if ($me) {
    if ($me.__typename == "Profile") {
      name = $me.firstName ? $me.firstName : "";
    } else if ($me.__typename == "Organisation") {
      name = $me.name ? $me.name : "";
    }
  }
}
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />

<PageHeader heightClass="h-28">
  <div class="self-center flex-grow text-center justify-self-start">
    <div class="text-xl">
      <h1 class="text-4xl text-white font-heading">
        <Label key="dapps.o-dashboard.atoms.dashboardHeader.welcome"  /> {name}
      </h1>
    </div>
  </div>
</PageHeader>
