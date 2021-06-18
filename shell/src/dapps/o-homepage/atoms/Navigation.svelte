<script lang="ts">
  import Hamburger from "./Hamburger.svelte";
  import Menu from "./Menu.svelte";

  export let sidebar = false;

</script>

<header
  class="fixed top-0 left-0 z-10 flex items-center justify-between w-full h-12 p-2 text-gray-600 bg-gray-100 border-b-2 md:h-20"
>
  <nav class="z-50 mt-2 lg:hidden">
    <Hamburger bind:open={sidebar} />
  </nav>

  <Menu />
</header>
