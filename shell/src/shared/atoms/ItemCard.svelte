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
    endTextBig: null,
    endTextBigClass: "text-success",
    endTextSmall: null,
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
      <div>
        <div class="avatar">
          <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
            <img
              src={params.imageUrl}
              alt={params.imageAlt ? params.imageAlt : params.title}
            />
          </div>
        </div>

      </div>
    </slot>

    <div
      class="relative flex-grow px-3 py-2 text-left title"
      class:truncate={params.truncateMain}
    >
      <div class:truncateThis={params.truncateMain}>
        <h2 class="text-base">{params.title}</h2>
      </div>
      <p
        class="mt-1 text-xs text-dark-lightest"
        class:truncateThis={params.truncateMain}
      >
        {params.subTitle}
      </p>
    </div>
    <slot name="itemCardEnd">
      <div>
        <div
          class="self-end text-right {params.endTextBigClass}"
          class:text-success={!params.endTextBigClass}
        >
          <span>{params.endTextBig}</span>
        </div>
        <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
          <span>{params.endTextSmall}</span>
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
