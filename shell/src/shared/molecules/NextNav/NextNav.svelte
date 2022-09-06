<script lang="ts">
import NavPill from "./Components/NavPill.svelte";
import LoginPill from "./Components/LoginPill.svelte";

export let navigation: any;
export let width: string = "w-full";
</script>

<footer
  id="nextnav"
  class="fixed bottom-0 right-0 z-50 grid justify-center {width} h-20
  grid-cols-3 pb-3 auto-cols-max place-content-center text-dark">
  {#if navigation.leftSlot}
    <div
      class="flex items-center justify-center w-12 h-12 ml-4 rounded-full cursor-pointer bg-purple"
      on:click="{navigation.leftSlot.props.action}">
      <svelte:component this="{navigation.leftSlot.component}" {...navigation.leftSlot.props} on:menuButton />
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
  <div class="absolute bottom-0 right-0">
    <a href="/" class="w-2 h-2">&nbsp;</a>
  </div>
</footer>

<style>
#nextnav {
  --tw-text-opacity: 1;
  background-image: linear-gradient(180deg, rgba(149, 183, 202, 0) 0%, rgba(13, 43, 102, 0.3) 100%);
}
</style>
