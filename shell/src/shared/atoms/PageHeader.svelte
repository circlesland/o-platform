<script lang="ts">
export let heightClass: string = "h-56";
export let color: string = "";
export let largeHeader: boolean = false;
</script>

<header
  class="grid place-content-center text-white bg-cover {heightClass}
  overflow-hidden {color}"
  class:largeHeader>
  <slot />
</header>
