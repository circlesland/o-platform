<script lang="ts">
  import Hamburger from "./Hamburger.svelte";
  import Menu from "./Menu.svelte";

  export let sidebar = false;
</script>

<header
  class="flex items-center justify-between p-2 text-gray-600 bg-gray-100 border-b-2"
>
  <nav class="z-50 mt-2 lg:hidden">
    <Hamburger bind:open={sidebar} />
  </nav>

  <Menu />
</header>
