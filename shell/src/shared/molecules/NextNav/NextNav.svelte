<script lang="ts">
import NavPill from "./Components/NavPill.svelte";
import LoginPill from "./Components/LoginPill.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { cartContents } from "../../../dapps/o-marketplace/stores/shoppingCartStore";
import Icons from "../Icons.svelte";
// import { icons as Icon } from "@iconify/icons-heroicons";
import { push } from "svelte-spa-router";

export let runtimeDapp: RuntimeDapp<any>;
export let navigation: any;
export let width: string = "w-full";

console.log(runtimeDapp);
</script>

<footer
  id="nextnav"
  class="fixed bottom-0 right-0 z-50 grid justify-center {width} h-20
  grid-cols-3 pb-3 auto-cols-max place-content-center text-dark">
  {#if navigation.leftSlot}
    <div class="grid grid-cols-2">
      <div
        class="flex items-center justify-center w-12 h-12 ml-4 bg-white rounded-full cursor-pointer"
        on:click="{navigation.leftSlot.props.action}">
        <svelte:component this="{navigation.leftSlot.component}" {...navigation.leftSlot.props} on:menuButton />
      </div>
    </div>
  {/if}
  {#if navigation.navPill}
    <NavPill
      on:actionButton="{() => {
        navigation.navPill.center.props.action();
      }}"
      props="{navigation.navPill}" />
  {/if}
  {#if navigation.loginPill}
    <LoginPill
      on:actionButton="{() => {
        navigation.loginPill.props.action();
      }}"
      props="{navigation.loginPill}" />
  {/if}
  <div class="flex flex-row justify-end mr-4">
    {#if runtimeDapp && runtimeDapp.dappId !== "homepage:1" && !runtimeDapp.anonymous}
      <div class="flex items-center justify-center w-12 h-12 bg-white rounded-full cursor-pointer">
        <div class="relative cursor-pointer justify-self-center" on:click="{() => push(`#/marketplace/cart`)}">
          {#if $cartContents && $cartContents.length > 0}
            <div class="absolute left-0 w-full text-center text-secondary -top-4 font-heading">
              {$cartContents.length}
            </div>
          {/if}
          <Icons icon="shopping-cart" customClass="w-6 h-6 heroicon smallicon" />
        </div>
      </div>
    {/if}
  </div>
</footer>

<style>
#nextnav {
  --tw-text-opacity: 1;
  background-image: linear-gradient(180deg, rgba(149, 183, 202, 0) 0%, rgba(13, 43, 102, 0.3) 100%);
}
</style>
