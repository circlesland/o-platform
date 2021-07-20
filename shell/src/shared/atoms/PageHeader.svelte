<script lang="ts">
  export let heightClass: string = "h-60";
</script>

<header
  class="grid place-content-center text-white bg-cover mt-5 {heightClass} overflow-hidden bg-gradient-to-r from-gradient1 to-primary"
>
  <slot />
</header>
