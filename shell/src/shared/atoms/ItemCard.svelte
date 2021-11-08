<script lang="ts">
import { Action } from "rxjs/internal/scheduler/Action";
import { push } from "svelte-spa-router";
import Icons from "src/shared/molecules/Icons.svelte";
import UserImage from "src/shared/atoms/UserImage.svelte";
import { isMobile } from "../functions/isMobile";

export let params = {
  imageUrl: null,
  imageAlt: null,
  title: null,
  subTitle: null,
  noTruncate: null,
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
  profileLink: null,
  noLink: false,
};

let textCutoff = isMobile() ? 20 : 42;

if (params.noTruncate) {
  textCutoff = 256;
}

// TODO: find a better way for this.
function cardAction() {
  if (params.action) {
    params.action();
  }
}
</script>

<section on:click="{() => cardAction()}" class:mb-3="{!params.inline}">
  <div
    class="flex items-center w-full space-x-2 bg-white rounded-lg shadow-sm"
    class:p-3="{!params.edgeless}">
    <slot name="itemCardStart">
      <div class="">
        {#if params.imageProfile}
          <UserImage
            profile="{params.imageProfile}"
            size="{12}"
            profileLink="{params.profileLink}" />
        {:else if params.imageUrl}
          <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
            <span
              on:click="{(e) => {
                if (params.imageAction) params.imageAction(e);
              }}">
              <img
                class="rounded-full"
                src="{params.imageUrl}"
                alt="{params.imageAlt ? params.imageAlt : params.title}" />
            </span>
          </div>
        {/if}
      </div>
    </slot>
    <slot name="itemCardBody">
      <div class="flex-col flex-grow">
        <div
          class="flex flex-row items-center justify-between text-left"
          class:px-3="{params.imageUrl}">
          <div class="flex-grow min-w-0">
            <h2
              class="overflow-hidden text-base whitespace-nowrap overflow-ellipsis">
              {params.title
                ? params.title.length >= textCutoff
                  ? params.title.substr(0, textCutoff) + "..."
                  : params.title
                : ""}
            </h2>
          </div>
          <div
            class="self-end text-right pl-2 {params.endTextBigClass}"
            class:text-success="{!params.endTextBigClass}">
            <span>{params.endTextBig ? params.endTextBig : ""}</span>
          </div>
        </div>
        <div
          class="flex flex-row items-center justify-between text-left"
          class:px-3="{params.imageUrl}">
          <div class="flex-grow leading-none">
            <span class="inline-block text-xs text-dark-lightest">
              {params.subTitle
                ? params.subTitle.length >= textCutoff + 6
                  ? params.subTitle.substr(0, textCutoff + 6) + "..."
                  : params.subTitle
                : ""}
            </span>
          </div>
          <div
            class="text-xs text-right text-dark-lightest whitespace-nowrap leading-non">
            <slot name="itemCardEndSmallElement">
              <span class="inline-block">
                {params.endTextSmall ? params.endTextSmall : ""}
              </span>
            </slot>
          </div>
        </div>
      </div>
    </slot>
  </div>
</section>

<!-- 
<section
  on:click="{() => cardAction()}"
  class="flex items-center justify-center cursor-pointer"
  class:mb-3="{!params.inline}"
  class:cursor-pointer="{!params.noLink}">
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
              <span
                on:click="{(e) => {
                  if (params.imageAction) params.imageAction(e);
                }}">
                <img
                  class="rounded-full"
                  src="{params.imageUrl}"
                  alt="{params.imageAlt ? params.imageAlt : params.title}" />
              </span>
            </div>
          {/if}
        </div>
      </div>
    </slot>
    <slot name="itemCardText">
      <div
        class="flex-grow h-12 py-1 text-left title"
        class:px-3="{params.imageUrl}">
        <div class="w-full h-4 mb-4 ">
          <h2 class="text-base">
            {params.title
              ? params.title.length >= 20
                ? params.title.substr(0, 20) + "..."
                : params.title
              : ""}
          </h2>
        </div>
        <p
          class="w-full h-4 mt-6 overflow-hidden text-xs text-dark-lightest whitespace-nowrap">
          {params.subTitle}
        </p>
      </div>
    </slot>

    <slot name="itemCardEnd">
      <div>
        <div
          class="self-end text-right pl-2 {params.endTextBigClass}"
          class:text-success="{!params.endTextBigClass}">
          <span>{params.endTextBig}</span>
        </div>
        <div class="self-end pl-2 text-xs text-dark-lightest whitespace-nowrap">
          <span>{params.endTextSmall}</span>
        </div>
      </div>
    </slot>
  </div>
</section> -->
<style>
.status.sending {
  @apply bg-primary;
}
.status.received,
.status.delivered {
  @apply bg-success;
}
</style>
