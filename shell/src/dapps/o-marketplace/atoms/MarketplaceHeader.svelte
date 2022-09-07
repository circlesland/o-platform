<script lang="ts">
import TopNav from "../../../shared/atoms/TopNav.svelte";
import PageHeader from "../../../shared/atoms/PageHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { me } from "../../../shared/stores/me";

import { Currency } from "../../../shared/currency";
import { BN } from "ethereumjs-util";
import { assetBalances } from "../../../shared/stores/assetsBalances";
import Icons from "../../../shared/molecules/Icons.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />

<PageHeader heightClass="h-60 sm:h-80" color="bg-marketplace" largeHeader="{true}">
  <div
    class="flex items-center px-10 h-52 sm:h-96 bg-marketplace-light"
    style="border-radius: 60% 74% 85% 69% / 89% 77% 106% 81%">
    <div class="pt-2 text-white">
      <span class="inline-block tracking-wide font-heading">
        <section class="m-4 -mb-4 text-center">
          <h1 class="text-3xl sm:text-5xl">Welcome to the Market</h1>
          <span class="text-xl sm:text-3xl">Please choose your location</span>
        </section>
      </span>
    </div>
  </div>
</PageHeader>

<style>
.blob {
  position: absolute;
  right: -30px;
  top: -30px;
}
</style>
