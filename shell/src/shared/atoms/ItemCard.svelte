<script lang="ts">
  import { Action } from "rxjs/internal/scheduler/Action";
  import { push } from "svelte-spa-router";
  import Icons from "src/shared/molecules/Icons.svelte";
  import UserImage from "src/shared/atoms/UserImage.svelte";

  export let params = {
    imageUrl: null,
    imageAlt: null,
    title: null,
    subTitle: null,
    truncateMain: null,
    edgeless: null,
    inline: false,
    shadowSmall: true,
    shadowMedium: null,
    noShadow: false,
    action: null,
    imageAction: null,
    endTextBig: null,
    endTextBigClass: "text-success",
    endTextSmall: null,
    imageProfile: null,
  };

  // TODO: find a better way for this.
  function cardAction() {
    if (params.action) {
      params.action();
    }
  }
</script>

<section
  on:click="{() => cardAction()}"
  class="flex items-center justify-center cursor-pointer"
  class:mb-3="{!params.inline}">

  <div
    class="flex items-center w-full space-x-2 bg-white rounded-lg"
    class:shadow-sm="{!params.shadowMedium && !params.noShadow}"
    class:shadow-md="{params.shadowMedium && !params.noShadow}"
    class:p-3="{!params.edgeless}">
    <slot name="itemCardStart">

      <div>
        <div class="inline-flex">
          {#if params.imageProfile}
            <UserImage profile="{params.imageProfile}" size="{12}" />
          {:else if params.imageUrl}
            <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
              <a
                on:click="{e => {
                  if (params.imageAction) params.imageAction(e);
                }}">
                <img
                  class="rounded-full"
                  src="{params.imageUrl}"
                  alt="{params.imageAlt ? params.imageAlt : params.title}" />
              </a>
            </div>
          {/if}
        </div>

      </div>

    </slot>
    <slot name="itemCardText">
      <div
        class="relative flex-grow h-12 py-1 text-left title"
        class:px-3="{params.imageUrl}"
        class:truncate="{params.truncateMain}">
        <div
          class="absolute w-full h-4 mb-4 "
          class:truncateThis="{params.truncateMain}">
          <h2 class="text-base">{params.title}</h2>
        </div>
        <p class="absolute w-full h-4 mt-6 text-xs text-dark-lightest">
          {params.subTitle}
        </p>
      </div>
    </slot>
    <slot name="itemCardEnd">
      <div>
        <div
          class="self-end text-right {params.endTextBigClass}"
          class:text-success="{!params.endTextBigClass}">
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
