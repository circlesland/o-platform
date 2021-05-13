<script lang="ts">
  import Hamburger from "./Hamburger.svelte";
  import Menu from "./Menu.svelte";

  export let sidebar = false;
</script>

<header
  class="flex justify-between bg-gray-200 p-2 items-center text-gray-600 border-b-2"
>
  <nav class="mt-2 z-50 lg:hidden">
    <Hamburger bind:open={sidebar} />
  </nav>

  <Menu />
</header>
