<script lang="ts">
  import { isMobile } from "src/shared/functions/isMobile"
  import Icons from "src/shared/molecules/Icons.svelte"

  export let pages: { title: string }[] = []

  const navClasses = isMobile()
    ? "absolute z-50 grid w-full grid-cols-3 carousel top-11"
    : "absolute grid w-full grid-cols-3 carousel top-11"

  const arrowClass = isMobile()
    ? "fixed z-50 cursor-pointer top-1/2 left-1"
    : "fixed cursor-pointer top-1/2 left-2"
</script>

<nav class="{navClasses}">
  <div class="col-start-2 place-self-center">
    {#each pages as page, i}
      <input
        id="carousel-item-{i}"
        type="radio"
        name="carousel-dots"
        class="hidden"
        checked="{false}" />
      <label for="carousel-item-{i}" class="mx-1">{page.title} {i}</label>
    {/each}
  </div>
</nav>
{#if true}
  <div class="{arrowClass}">
    <Icons icon="simplearrowleft" />
  </div>
{/if}
{#if true}
  <div class="{arrowClass}">
    <Icons icon="simplearrowright" />
  </div>
{/if}
