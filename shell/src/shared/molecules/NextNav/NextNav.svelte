<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";

  import FilterComponent from "./Components/Filter.svelte";
  import ListComponent from "./Components/List.svelte";
  import LinkComponent from "./Components/Link.svelte";
  // import {runProcess} from "../../../shared/molecules/Modal2.svelte";
  import NavPill from "./Components/NavPill.svelte";
  import ProcessPill from "./Components/ProcessPill.svelte";
  import LoginPill from "./Components/LoginPill.svelte";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  //  import {ModalChanged} from "@o-platform/o-events/dist/shell/modalChanged";

  export let login: boolean = false;
  export let isOpen: boolean = false;
  export let modalProcess;
  export let lastPrompt;
  export let navigation: any;
  let component;
  let props;
  let newnav: any;
  const current = writable(null);
  setContext("nav", current);

  onMount(() => {
    window.o.events.subscribe(async (event: PlatformEvent) => {
      if (event.type === "shell.modalChanged") {
        //isOpen = (<ModalChanged>event).isOpen;
        lastPrompt = null;
      }
    });
  });
</script>

<footer
  id="nextnav"
  class="fixed bottom-0 z-50 grid justify-center w-full h-20 grid-cols-3 pb-3 auto-cols-max place-content-center text-secondary"
>
  {#if navigation.leftSlot}
    <div
      class="w-12 h-12 px-3 py-3 ml-4 bg-white rounded-full cursor-pointer"
      class:hidden={isOpen}
    >
      <svelte:component
        this={navigation.leftSlot.component}
        {...navigation.leftSlot.props}
        {isOpen}
        on:menuButton
      />
    </div>
  {/if}

  {#if isOpen}
    <ProcessPill {modalProcess} {lastPrompt} on:actionButton {isOpen} />
  {:else if login}
    <LoginPill props={navigation.loginPill} />
  {:else}
    <NavPill
      props={navigation.navPill}
      on:actionButton
      {isOpen}
      on:menuButton
    />
  {/if}
</footer>

<style>
  #nextnav {
    --tw-text-opacity: 1;
    background-image: linear-gradient(
      180deg,
      rgba(149, 183, 202, 0) 0%,
      rgba(13, 43, 102, 0.5) 100%
    );
  }
</style>
