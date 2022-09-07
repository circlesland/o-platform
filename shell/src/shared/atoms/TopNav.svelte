<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { cartContents } from "../../dapps/o-marketplace/stores/shoppingCartStore";
import { me } from "../stores/me";
import { Profile } from "../api/data/types";
import { push } from "svelte-spa-router";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import LangSwitcher from "./LangSwitcher.svelte";
export let runtimeDapp: RuntimeDapp<any>;
let profile: Profile;
let showSwitcher = true;
$: name = profile?.circlesAddress ? profile.circlesAddress : "";
$: {
  if ($me) {
    profile = $me;
  } else {
    profile = undefined;
  }
}
console.log("RU", runtimeDapp.routeParts[0]);
</script>

<!-- bg-home bg-cpurple bg-marketplace bg-contact bg-passport -->
<div class="fixed top-0 left-0 z-50 w-full">
  <div class="grid w-full grid-cols-2 mx-auto text-white navbar justify-items-stretch">
    <div
      class="p-3 pr-12 -mt-2 justify-self-start whitespace-nowrap {runtimeDapp.routeParts[0]
        ? 'bg-' + runtimeDapp.routeParts[0].replace('=', '')
        : 'bg-cpurple'} navbarHomeElement">
      <img src="/logos/circles.svg" class="w-8 h-8" alt="Circles Land" />
      <span class="ml-2 text-4xl uppercase font-heading text-light">
        {runtimeDapp ? runtimeDapp.title : "<<No dapp>>"}
      </span>
    </div>

    <div class="col-start-3 pr-1 place-self-center justify-self-end">
      <span
        class="mr-2 text-4xl uppercase sm:mr-40 font-heading "
        class:text-white="{runtimeDapp.routeParts[0].replace('=', '') != 'home'}"
        class:text-passport="{runtimeDapp.routeParts[0].replace('=', '') === 'home'}">Beta</span>
      <!-- {#if runtimeDapp && runtimeDapp.dappId !== "homepage:1" && !runtimeDapp.anonymous}
        <div class="relative mr-4 cursor-pointer justify-self-center" on:click="{() => push(`#/marketplace/cart`)}">
          {#if $cartContents && $cartContents.length > 0}
            <div class="absolute left-0 w-full text-center text-secondary -top-4 font-heading">
              {$cartContents.length}
            </div>
          {/if}
          <Icon name="shopping-cart" class="w-6 h-6 heroicon smallicon" />
        </div>
      {/if}
      {#if profile}
        {#if profile.__typename === "Organisation"}
          <div class="mr-4 text-white cursor-pointer" on:click="{() => push(`#/marketplace/scan-purchase`)}">
            <Icon name="qrcode" class="w-6 h-6 heroicon smallicon" />
          </div>
        {/if}
      {/if} -->
    </div>
  </div>
</div>
