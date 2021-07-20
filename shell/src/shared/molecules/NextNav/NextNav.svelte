<script lang="ts">
  import NavPill from "./Components/NavPill.svelte";
  import LoginPill from "./Components/LoginPill.svelte";

  export let navigation: any;
  export let width: string = "w-full";

  console.log("NAVIGATION: ", navigation);
</script>

<footer
  id="nextnav"
  class="fixed bottom-0 right-0 z-50 grid justify-center {width} h-20
  grid-cols-3 pb-3 auto-cols-max place-content-center text-dark"
>
  {#if navigation.leftSlot}
    <div
      class="w-12 h-12 px-3 py-3 ml-4 bg-white rounded-full cursor-pointer"
      on:click={navigation.leftSlot.props.action}
    >
      <svelte:component
        this={navigation.leftSlot.component}
        {...navigation.leftSlot.props}
        on:menuButton
      />
    </div>
  {/if}

  {#if navigation.loginPill}
    <LoginPill />
  {:else}
    <NavPill props={navigation.navPill} />
  {/if}
</footer>

<style>
  #nextnav {
    --tw-text-opacity: 1;
    background-image: linear-gradient(
      180deg,
      rgba(149, 183, 202, 0) 0%,
      rgba(13, 43, 102, 0.3) 100%
    );
  }
</style>
