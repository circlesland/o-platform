<script lang="ts">
export let heightClass: string = "h-56";
</script>

<header
  class="grid place-content-center text-white bg-cover {heightClass}
  overflow-hidden">
  <slot />
</header>
