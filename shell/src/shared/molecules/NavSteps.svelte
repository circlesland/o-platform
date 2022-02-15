<script lang="ts">
  export let steps;
</script>

<div class="relative z-30 w-full overflow-auto">
  <nav class="grid w-full grid-cols-3 carousel top-11">

    {#if steps}
      <div class="col-start-2 place-self-center">
        {#each steps as step, i}
          <input
            id="carousel-item-{i}"
            type="radio"
            name="carousel-dots"
            class="hidden"
            checked="{step.isActive}" />
          <label for="carousel-item-{i}" class="mx-1">{i}</label>
        {/each}
      </div>
    {/if}
  </nav>
</div>

<style>
  /* All styling takes place on the label element */
  nav.carousel label {
    @apply inline-block;
    @apply bg-dark-lightest;
    @apply overflow-hidden;
    @apply rounded-full;
    @apply w-2;
    @apply h-2;
    text-indent: -999px;
    /* box-shadow: inset 0 1px 1px 0 #999; */
  }
  nav.carousel label:hover {
    @apply bg-dark-lightest;
    @apply cursor-pointer;
    /* box-shadow: inset 0 1px 1px 0 #777; */
  }
  nav.carousel input:checked + label {
    @apply bg-dark;
    /* box-shadow: inset 0 0 1px 1px #087dc0; */
  }
</style>
