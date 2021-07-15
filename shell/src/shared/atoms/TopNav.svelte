<script lang="ts">
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import { push } from "svelte-spa-router";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let navigateablePages = runtimeDapp.routables.filter((o) => !o.isSystem);
  console.log("PAGES: ", navigateablePages);

  // Yeaahh, this is NOT exactly the most beautiful way of doing this
  // Let's see if we can store a 'self link' in each routable...

  function openPage(route) {
    let link =
      runtimeDapp.routeParts
        .map((o) => (o.startsWith("=") ? o.replace("=", "") : o))
        .join("/") +
      "/" +
      route.routeParts
        .map((o) => (o.startsWith("=") ? o.replace("=", "") : o))
        .join("/");
    push(`#/${link}`);
  }
</script>

<div class="fixed top-0 left-0 z-10 w-full">
  <div
    class="grid w-full grid-cols-3 p-2 pl-4 mx-auto text-white navbar bg-dark "
  >
    <div class="justify-self-start">
      <span class="text-lg uppercase ">
        {runtimeDapp.title}
      </span>
    </div>
    {#if routable.title != routable.title}
      <div class="justify-self-center">
        <span class="text-sm ">
          {routable.title}
        </span>
      </div>
    {/if}
  </div>
  <div class="flex flex-row justify-center mt-2">
    <nav class="carousel">
      {#each navigateablePages as page, i}
        <input
          id="carousel-item-{i}"
          type="radio"
          name="carousel-dots"
          checked={routable.title == page.title}
          on:click={() => openPage(page)}
        />
        <label for="carousel-item-{i}" class="mx-1">{page.title} {i}</label>
      {/each}
    </nav>
  </div>
</div>

<style>
  nav.carousel:hover {
    @apply cursor-default;
  }

  /* Hide the radio button */
  nav.carousel input[type="radio"] {
    display: none;
  }

  /* All styling takes place on the label element */
  nav.carousel label {
    @apply inline-block;
    @apply bg-light;
    @apply overflow-hidden;
    @apply rounded-full;
    @apply w-3;
    @apply h-3;
    text-indent: -999px;
    /* box-shadow: inset 0 1px 1px 0 #999; */
  }
  nav.carousel label:hover {
    @apply bg-light;
    @apply cursor-pointer;
    /* box-shadow: inset 0 1px 1px 0 #777; */
  }
  nav.carousel input:checked + label {
    @apply bg-dark;
    /* box-shadow: inset 0 0 1px 1px #087dc0; */
  }
</style>
