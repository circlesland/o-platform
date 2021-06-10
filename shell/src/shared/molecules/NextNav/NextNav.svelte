<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import ActionButtonComponent from "./Components/ActionButton.svelte";
  import FilterComponent from "./Components/Filter.svelte";
  import ListComponent from "./Components/List.svelte";
  import LinkComponent from "./Components/Link.svelte";
  import NavPill from "./Components/NavPill.svelte";
  import ProcessPill from "./Components/ProcessPill.svelte";

  export let isOpen: boolean = false;
  export let modalProcess;
  let component;
  let props;
  let newnav: any;
  const current = writable(null);
  setContext("nav", current);

  $: {
    newnav = {
      // leftSlot: {
      //   component: FilterComponent,
      //   props: {
      //     icon: "filter",
      //   },
      // },
      navPill: {
        type: "menu", // menu|process|detail
        left: {
          component: ListComponent,
          props: {
            icon: "list",
            action: "dappsList",
          },
        },
        right: {
          component: LinkComponent,
          props: {
            icon: "home",
            action: "link",
            link: "#/dashboard",
          },
        },
        actionButton: {
          component: ActionButtonComponent, // action|
          props: {
            disabled: false,
            actions: ["logout"],
          },
        },
      },
      processPill: {
        modalProcess: modalProcess,
        isOpen: true,
        back: true,
        skip: true,
        actionButton: {
          component: ActionButtonComponent, // action|
          props: {
            action: "close",
          },
        },
      },
    };
  }
  const list = () => {
    component = ListComponent;
    props = { page2Prop: 2 };
  };

  const filter = () => {
    component = FilterComponent;
    props = { page2Prop: 2 };
  };

</script>

<footer
  id="nextnav"
  class="fixed bottom-0 z-50 grid justify-center w-full h-20 grid-cols-3 auto-cols-max place-content-center"
>
  {#if newnav.leftSlot}
    <div
      class="w-12 h-12 px-3 py-3 ml-4 bg-white rounded-full text-secondary"
      class:hidden={isOpen}
    >
      <svelte:component
        this={newnav.leftSlot.component}
        {...newnav.leftSlot.props}
      />
    </div>
  {/if}
  {#if isOpen}
    <ProcessPill props={newnav.processPill} on:actionButton {isOpen} />
  {:else}
    <NavPill props={newnav.navPill} on:actionButton {isOpen} />
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
