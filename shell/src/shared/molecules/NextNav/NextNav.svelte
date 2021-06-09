<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import ActionButtonComponent from "./Components/ActionButton.svelte";
  import FilterComponent from "./Components/Filter.svelte";
  import ListComponent from "./Components/List.svelte";
  import LinkComponent from "./Components/Link.svelte";
  import NavPill from "./Components/NavPill.svelte";

  export let segment;
  export let isOpen: boolean = false;

  let component;
  let props;

  const current = writable(null);
  setContext("nav", current);

  $: $current = segment;

  const newnav = {
    leftSlot: {
      component: FilterComponent,
      props: {
        icon: "filter",
      },
    },
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
          action: "quick",
          actions: ["logout"],
          isActive: false,
        },
      },
    },
  };

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
  class="fixed bottom-0 z-50 grid justify-center w-full h-20 grid-cols-4 auto-cols-max place-content-center"
>
  <div class="w-12 h-12 px-3 py-3 ml-4 bg-white rounded-full text-secondary">
    <svelte:component
      this={newnav.leftSlot.component}
      {...newnav.leftSlot.props}
    />
  </div>
  <div class="h-12 col-span-2 px-2 py-3 bg-white rounded-full">
    <NavPill props={newnav.navPill} on:actionButton {isOpen} />
  </div>
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
