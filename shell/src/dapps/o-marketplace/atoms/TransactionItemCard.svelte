<script lang="ts">
  import { push } from "svelte-spa-router";

  import { Offer } from "../data/api/types";
  import Icons from "../../../shared/molecules/Icons.svelte";

  export let offer: Offer;

  function loadDetailPage() {
    push("#/marketplace/offer/" + offer.id);
  }
</script>

<section
  on:click|once={() => loadDetailPage()}
  class="flex items-center justify-center mb-3 "
>

  <div
    class="flex items-center w-full space-x-2 bg-white rounded-lg shadow-sm "
  >
    <div class="relative w-16 h-16 overflow-hidden rounded-l-lg image-wrapper">
      <img
        src={offer.pictureUrl ? offer.pictureUrl : '/images/market/circles-no-image.jpg'}
        alt=""
        class="absolute object-cover w-20 h-16 rounded-l-lg"
      />
    </div>

    <div class="relative flex-grow px-3 py-2 text-left truncate title">
      <div class="truncateThis">
        <h2 class="text-base">{offer.title}</h2>
      </div>
      <p class="mt-1 text-xs text-dark-lightest">{offer.description}</p>
    </div>
    <div
      class="px-3 py-2 title status {offer.status} bg-success w-16 h-16
      rounded-r-lg"
    >
      <div class="mt-1 overflow-hidden text-center">
        <div class="px-2">
          <Icons icon="home" />
        </div>
        <span class="block mt-1 text-3xs">sending</span>
      </div>
    </div>
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
