<script lang="ts">
import { purchase } from "../processes/purchase";

import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";
import { EditorContext } from "@o-platform/o-editors/src/editorContext";
import { upsertShippingAddress } from "../../o-passport/processes/upsertShippingAddress";
import { me } from "../../../shared/stores/me";
import { PostAddress } from "../../../shared/api/data/types";
import formatShippingAddress from "../../../shared/functions/formatPostAddress";

export let context: EditorContext;

let checked: boolean = false;
let balance: number = 0;
let shippingAddressId: number;
let deliveryType: number = 1;
let error: string = null;

onMount(() => {
  const availableDeliveryMethods = context.data.availableDeliveryMethods
    ? context.data.availableDeliveryMethods
    : context.params.availableDeliveryMethods;

  if (availableDeliveryMethods) {
    if (!context.data[context.field]) {
      deliveryType = 1;
    } else {
      deliveryType = context.data[context.field].deliveryMethodId;
      shippingAddressId = context.data[context.field].shippingAddressId;
    }
  }
});

function submit() {
  let selectedCountry = null;
  if (shippingAddressId) {
    selectedCountry = $me.shippingAddresses.find((o) => o.id == shippingAddressId).country;
  }

  console.log(selectedCountry);
  console.log(shippingAddressId);
  if (selectedCountry && selectedCountry != "Germany") {
    error = "This shop only delivers to Germany. Please select or enter a German Postal Address.";
  } else {
    const answer = new Continue();

    answer.data = {
      [context.field]: {
        deliveryMethodId: deliveryType,
        shippingAddressId: shippingAddressId,
      },
    };

    context.process.sendAnswer(answer);
  }
}

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    submit();
  }
}

async function restartPurchase(shippingAddressId: number, oldContext: EditorContext) {
  window.o.runProcess(purchase, {
    [context.field]: {
      deliveryMethodId: 2, // TODO: Magic number stands for "delivery"
      shippingAddressId: shippingAddressId,
    },
    ...oldContext.data,
  });
}
</script>

{#if error}
  <div class="text-center text-alert">{error}</div>
{/if}
<div class="p-5">
  <div>
    <div class="form-control">
      <label class="cursor-pointer label">
        <input
          type="radio"
          class=" radio radio-primary radio-sm"
          bind:group="{deliveryType}"
          name="deliveryType"
          value="{2}" />
        <span class="pb-2 align-baseline">I want this order to be delivered to me</span>
      </label>
    </div>
    <div class="form-control">
      <label class="cursor-pointer label">
        <input
          type="radio"
          class="radio radio-primary radio-sm"
          checked
          bind:group="{deliveryType}"
          name="deliveryType"
          value="{1}" />
        <span class="inline"> I want to pick this order up at the store</span>
      </label>
    </div>
    {#if deliveryType === 2}
      <div id="addreses" class="form-control">
        <label class="cursor-pointer label" for="addresses">
          {#if $me.shippingAddresses && $me.shippingAddresses.length > 0}
            <select class="select select-bordered" bind:value="{shippingAddressId}">
              {#each $me.shippingAddresses as shippingAddress}
                <option value="{shippingAddress.id}">{formatShippingAddress(shippingAddress)}</option>
              {/each}
            </select>
          {/if}
          <div>
            <button
              class="mt-2 btn btn-sm btn-primary"
              on:click="{() => {
                const currentContext = context;
                window.o.runProcess(upsertShippingAddress, {
                  successAction: (data) => {
                    console.log('RestartPurchaseProcess', data);
                    setTimeout(() => {
                      restartPurchase(data.id, currentContext);
                    }, 30);
                  },
                });
              }}">Add Address</button>
          </div>
        </label>
      </div>
    {:else}
      <div class="flex flex-col mt-4 space-y-2 text-center">
        {#if context.data.shop.pickupAddress}
          <div>You can pick up your order at:</div>

          <div class="font-bold">{@html formatShippingAddress(context.data.shop.pickupAddress, true)}</div>
        {/if}
        {#if context.data.shop.openingHours}
          <div class="pt-2">Our Opening Hours are:</div>

          <div>{@html context.data.shop.openingHours}</div>
        {/if}
      </div>
    {/if}
  </div>
</div>
<ProcessNavigation
  isDisabled="{deliveryType === 2 && (!$me.shippingAddresses || $me.shippingAddresses.length === 0)}"
  on:buttonClick="{() => submit()}"
  context="{context}"
  noSticky="{true}" />
