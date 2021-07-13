<script lang="ts">
  export let heightClass: string = "h-60";
</script>

<header
  class="grid place-content-center text-white bg-cover {heightClass} overflow-hidden bg-gradient-to-r from-primary to-secondary-light"
>
  <slot />
</header>
