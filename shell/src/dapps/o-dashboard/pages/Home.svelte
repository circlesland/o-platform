<script lang="ts">
import { me } from "../../../shared/stores/me";
import { onMount } from "svelte";
import { push } from "svelte-spa-router";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Capability, CapabilityType } from "../../../shared/api/data/types";
import { getSessionInfo } from "../../o-passport/processes/identify/services/getSessionInfo";
import DashboardHeader from "../atoms/DashboardHeader.svelte";
import Icons from "../../../shared/molecules/Icons.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let capabilities: Capability[] | undefined = [];

$: me;

let disableBanking: boolean = false;
let canVerify: boolean = false;

let safeDeployThreshold: string = "200000000000000000";

const init = async () => {
  const pk = sessionStorage.getItem("circlesKey");
  disableBanking = !pk;

  const sessionInfo = await getSessionInfo();
  capabilities = sessionInfo.capabilities;
  canVerify =
    capabilities &&
    capabilities.find((o) => o.type == CapabilityType.Verify) !== undefined;
};

let showInviteButton = false;

onMount(init);

function loadLink(link, external = false) {
  if (external) {
    window.open(link, "_blank").focus();
  } else {
    push(link);
  }
}
</script>

<DashboardHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div class="mx-auto md:w-2/3 xl:w-1/2">
  <div class="m-4 mb-20 -mt-4">
    <div
      class="grid grid-cols-2 gap-4 text-base auto-rows-fr dashboard-grid lg:grid-cols-3">
      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
        on:click="{() => loadLink('/passport/profile')}">
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
          <div class="pt-2 text-primary">
            <Icons icon="dashpassport" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">passport</div>
        </div>
      </section>
      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
        on:click="{() => loadLink('/friends/chat')}">
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
          <div class="pt-2 text-primary">
            <Icons icon="dashfriends" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">friends</div>
        </div>
      </section>
      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
        on:click="{() => loadLink('/banking/transactions')}">
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
          <div class="pt-2 text-primary">
            <Icons icon="dashbanking" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">banking</div>
        </div>
      </section>
      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
        on:click="{() => loadLink('/marketplace/market')}">
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
          <div class="pt-2 text-primary">
            <Icons icon="dashmarket" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">market</div>
        </div>
      </section>
      <!--
      {#if canVerify}
        <section
          class="flex items-center justify-center bg-white rounded-lg shadow-md cursor-pointer dashboard-card"
          on:click="{() => loadLink('/verification')}">
          <div
            class="flex flex-col items-center w-full p-4 pt-6 justify-items-center">
            <div class="pt-2 text-primary">
              <Icons icon="check" size="{12}" />
            </div>
            <div class="mt-4 text-3xl font-heading text-dark">verified</div>
          </div>
        </section>
      {/if}-->
    </div>
  </div>
</div>

<style>
.dashboard-grid {
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  grid-auto-rows: 1fr;
}
@media (min-width: 640px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, minmax(8rem, 1fr));
  }
}

.dashboard-grid::before {
  content: "";
  width: 0;
  padding-bottom: 100%;
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}

.dashboard-grid > *:first-child {
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}
</style>
