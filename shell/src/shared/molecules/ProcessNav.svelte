<script lang="ts">
  import { faTimes } from "@fortawesome/free-solid-svg-icons";
  import NavItem from "../atoms/NavItem.svelte";

  export let isOpen: boolean;

  const close = {
    data: {
      label: window.i18n("shared.molecules.processNav.close"),
    },
    design: {
      icon: faTimes,
    },
  };
</script>

<div
  on:click={() => {
    isOpen = false;
  }}>
  <NavItem mapping={close} />
</div>
