<script lang="ts">

  import {push} from "svelte-spa-router";
  import {Offer} from "../data/api/types";
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {shellProcess, ShellProcessContext} from "../../../shared/processes/shellProcess";
  import {purchase} from "../processes/purchase";

  export let offer: Offer;

  $: {
  }

  function loadDetailPage() {
    push("#/marketplace/offers/" + offer.id);
  }

  function buy() {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = purchase;
        ctx.childContext = {
          data: {
          },
        };
        return ctx;
      })
    );
  }

  function edit() {

  }
</script>

<section
  class="flex items-center justify-center mb-2 text-circlesdarkblue"
  on:click|once={() => loadDetailPage()}
>
  <div
    class="flex items-center w-full px-4 pt-5 space-x-2 bg-white rounded-sm shadow sm:space-x-6"
  >
    <div class="mr-2 -mt-3 text-center">
      <div class="avatar">
        <div class="w-12 h-12 m-auto rounded-full sm:w-12 sm:h-12">
          <img src={offer.pictureUrl} alt={offer.title} />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="max-w-full cursor-pointer truncateThis">
        <h2 class="text-2xl sm:text-3xl">
          {offer.title}
        </h2>
        {#if offer.description}
          <span class="inline text-dark">{offer.description}</span><br/>
        {/if}
        <span class="inline text-sm">{offer.deliveryTerms}</span><br/>
      </div>

      <div class="mb-4 text-sm text-left text-green">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="inline w-4 h-4 -mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
        Category: <span class="inline text-dark">{offer.category}</span><br/>
        <svg
                xmlns="http://www.w3.org/2000/svg"
                class="inline w-4 h-4 -mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
        >
          <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
        Location: <span class="inline text-dark">{offer.city.name} ({offer.city.country})</span><br/>
        <svg
                xmlns="http://www.w3.org/2000/svg"
                class="inline w-4 h-4 -mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
        >
          <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
        Unit: <span class="inline text-dark">{offer.unit}</span><br/>
        <svg
                xmlns="http://www.w3.org/2000/svg"
                class="inline w-4 h-4 -mt-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
        >
          <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
        Price per unit: <span class="inline text-dark">{offer.pricePerUnit}</span> Circles<br/>
        {#if offer.maxUnits !== undefined}
          <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="inline w-4 h-4 -mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
          >
            <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          Max. units: <span class="inline text-dark">{offer.maxUnits}</span>
        {/if}
      </div>
    </div>

    <div class="flex flex-col self-start flex-1 justify-items-end">
      <div class="flex flex-col self-end space-y-2 text-2xl sm:text-3xl ">
        <button
          on:click={() => buy()}
          class="self-end btn btn-square btn-md btn-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      </div>
      <div class="self-end mt-2 text-xs text-circleslightblue">
           {offer.publishedAt} (9 days ago)
      </div>
    </div>
  </div>
</section>
