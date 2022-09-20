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

<PageHeader heightClass=" relative h-60 sm:h-80" color="bg-marketplace" largeHeader="{true}">
  <div
    class="absolute w-4/5 h-full overflow-hidden -top-6 -right-8 blob bg-marketplace-light"
    style="border-radius:60% 4% 83% 88% / 99% 50% 90% 81%">
    <div class="pt-2 text-white"></div>
  </div>
  <div class="flex items-center w-full pt-2 text-white ">
    <span class="inline-block tracking-wide font-heading">
      <div class="self-center block mt-2 text-center">
        <div class="relative pt-2 text-center text-white">
          <span class="inline-block tracking-wide font-heading">
            <section class="m-4 -mb-4 text-center">
              <h1 class="text-3xl sm:text-5xl">Welcome to the Market</h1>
              <span class="text-xl sm:text-3xl">Please choose your location</span>
            </section>
          </span>
        </div>
      </div>
    </span>
  </div>
</PageHeader>
