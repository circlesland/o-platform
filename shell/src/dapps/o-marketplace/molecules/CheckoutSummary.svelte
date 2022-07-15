<script lang="ts">
import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { Currency } from "../../../shared/currency";
import ShopMetadata from "../../../shared/molecules/ShopMetadata.svelte";
import { onMount } from "svelte";
import { _ } from "svelte-i18n";

export let context: any;
let metadataError: Boolean = false;
let placeholder: Boolean = true;
let metadata: any;
let isLoading: Boolean = true;

function submit() {
  if (context.data.shop.purchaseMetaDataKeys && metadataError) {
    return;
  }

  const answer = new Continue();

  context.data.metadata = metadata;
  answer.data = context.data;
  context.process.sendAnswer(answer);
}

onMount(() => console.log("CheckoutSummary context:", context));

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    submit();
  }
}
</script>

{#if context.data.items && context.data.shop}
  <div class="flex flex-col items-center self-center w-full m-auto space-y-4 text-center justify-self-center">
    <div>
      {#if context.data.shop && context.data.purchaseMetaDataKeys}
        <ShopMetadata
          jsonSchema="{context.data.purchaseMetaDataKeys}"
          bind:value="{metadata}"
          bind:error="{metadataError}" />
      {/if}
    </div>

    <div class="flex flex-col w-full mt-6 space-y-1">
      <div class="flex flex-col items-center w-full">
        <div class="flex flex-col w-full">
          <header class=" rounded-xl headerImageContainer">
            <div class="relative rounded-xl image-wrapper">
              <img src="{context.data.shop.smallBannerUrl}" alt="" class="w-full rounded-xl" />
              <div
                class="absolute right-0 px-2 mt-2 text-lg rounded-l-full sm:text-xl lg:pb-2 lg:pt-3 lg:pl-4 lg:pr-2 lg:text-3xl font-heading top-2 bg-light-lightest">
                <span class="inline-block">{context.data.shop.name}</span>
              </div>
            </div>
          </header>
        </div>
        {#each context.data.items as item, index}
          <div class="flex items-center justify-between w-full pb-6 mb-6 border-b" class:mt-8="{index == 0}">
            <div class="flex items-center w-full">
              <img class="w-16 rounded-full mask mask-circle" src="{item.pictureUrl}" alt="{item.title}" />
              <div class="flex flex-col items-start w-full ml-2 space-y-2">
                <div class="flex flex-row justify-between w-full">
                  <div class="md:text-md">{item.title}</div>
                </div>
                <div class="flex items-center justify-end w-full">
                  <div class="flex-grow text-sm text-left text-dark-lightest">
                    1 {item.unitTag ? item.unitTag.value : "item"}
                  </div>
                  <div class="flex pr-8">
                    <div
                      class="w-8 h-6 mx-2 text-sm text-center bg-gray-100 border rounded focus:outline-none "
                      type="text"
                      value="{item.qty}">
                      {item.qty}
                    </div>
                  </div>
                  <div class="items-center">
                    <span class="inline-block whitespace-nowrap"
                      >{item.pricePerUnit} <span class="font-enso"> €</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
      <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400">
          {$_("dapps.o-marketplace.molecules.checkoutSummary.total" )}
        </span>
        <span class="w-20 text-lg font-bold text-right">
          {context.data.total.toFixed(2)} €
        </span>
      </div>
      <!-- <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400">
          <Label key="dapps.o-marketplace.molecules.checkoutSummary.tax"  />
        </span>
        <span class="w-20 text-lg text-right font-primary text-dark-lightest">
          {((context.data.total.toFixed(2) / 1.19) * (19 / 100)).toFixed(2)} €
        </span>
      </div> -->
      <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400">Time Circles:</span>
        <span class="w-20 text-lg text-right font-primary text-dark-lightest"
          >{context.data.total * 10} {Currency.currencySymbol["TIME_CRC"]}</span>
      </div>
    </div>
  </div>
  <ProcessNavigation on:buttonClick="{submit}" context="{context}" noSticky="{true}" />
{/if}
