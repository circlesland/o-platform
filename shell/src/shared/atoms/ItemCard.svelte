<script lang="ts">
  import { Action } from "rxjs/internal/scheduler/Action";
  import { push } from "svelte-spa-router";
  import Icons from "src/shared/molecules/Icons.svelte";

  export let params = {
    imageUrl: null,
    imageAlt: null,
    title: null,
    subTitle: null,
    truncateMain: null,
    edgeless: null,
    shadow: null,
    action: null,
  };

  // TODO: find a better way for this.
  function cardAction() {
    if (params.action) {
      params.action();
    }
  }
</script>

<section
  on:click|once={() => cardAction()}
  class="flex items-center justify-center mb-3 "
>

  <div
    class="flex items-center w-full space-x-2 bg-white rounded-lg"
    class:shadow-sm={params.shadow}
    class:p-3={!params.edgeless}
  >
    <slot name="itemCardStart">
      <div
        class="relative w-16 h-16 overflow-hidden rounded-l-lg image-wrapper"
      >
        <img
          src={params.imageUrl ? params.imageUrl : '/images/market/circles-no-image.jpg'}
          alt={params.imageAlt ? params.imageAlt : params.title}
          class="absolute object-cover w-20 h-16 rounded-l-lg"
        />
      </div>
    </slot>

    <div
      class="relative flex-grow px-3 py-2 text-left title"
      class:truncate={params.truncateMain}
    >
      <div class:truncateThis={params.truncateMain}>
        <h2 class="text-base">{params.title}</h2>
      </div>
      <p class="mt-1 text-xs text-dark-lightest">{params.subTitle}</p>
    </div>
    <slot name="itemCardEnd">
      <div class="w-16 h-16 px-3 py-2 rounded-r-lg title status bg-success">
        <div class="mt-1 overflow-hidden text-center">
          <div class="px-2">
            <Icons icon="home" />
          </div>
          <span class="block mt-1 text-3xs">sending</span>
        </div>
      </div>
    </slot>
  </div>

</section>

<style>
  .status.sending {
    @apply bg-primary;
  }
  .status.received,
  .status.delivered {
    @apply bg-success;
  }
</style>
