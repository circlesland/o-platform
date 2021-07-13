<script lang="ts">
  export let heightClass: string = "h-60";
  export let headerBackground: string =
    "/images/common/headerbackground/header-background-default.jpg";
</script>

<header
  class="grid place-content-center text-white bg-cover mt-11 {heightClass} overflow-hidden bg-gradient-to-r from-primary to-secondary-light"
>
  <slot />
</header>
