<script lang="ts">
  export let heightClass: string = "h-60";
  export let headerBackground: string =
    "/images/common/headerbackground/header-background-default.jpg";
</script>

<header
  class="grid place-content-center text-white bg-cover rounded-t-lg {heightClass} overflow-hidden"
  style="background: linear-gradient(to right, #0f266280, #0f266280), url('{headerBackground}') no-repeat center center; background-size: cover;"
>
  <slot />
</header>
