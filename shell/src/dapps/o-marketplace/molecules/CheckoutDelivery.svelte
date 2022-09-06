<script lang="ts">
import { purchase } from "../processes/purchase";

import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";
import { EditorContext } from "@o-platform/o-editors/src/editorContext";
import { upsertShippingAddress } from "../../o-passport/processes/upsertShippingAddress";
import { me } from "../../../shared/stores/me";
import { DeliveryMethod, PostAddress } from "../../../shared/api/data/types";
import formatShippingAddress from "../../../shared/functions/formatPostAddress";
import Label from "../../../shared/atoms/Label.svelte";

export let context: EditorContext;

let checked: boolean = false;
let balance: number = 0;
let shippingAddressId: number;
let deliveryType: number = 1;
let error: string = null;
let availableDeliveryMethods: DeliveryMethod[];

onMount(() => {
  availableDeliveryMethods = context.data.shop.deliveryMethods;

  if (availableDeliveryMethods) {
    if (availableDeliveryMethods.length == 1) {
      deliveryType = availableDeliveryMethods[0].id;
    } else {
      if (!context.data[context.field]) {
        deliveryType = 1;
      } else {
        deliveryType = context.data[context.field].deliveryMethodId;
        shippingAddressId = context.data[context.field].shippingAddressId;
      }
    }
  } else {
    deliveryType = 1;
  }

  console.log("AVA", availableDeliveryMethods);
  console.log("context", context.data);
  console.log("DELT", deliveryType);
});

function submit() {
  let selectedCountry = null;
  if (shippingAddressId) {
    selectedCountry = $me.shippingAddresses.find((o) => o.id == shippingAddressId).country;
  }

  console.log(selectedCountry);
  console.log(shippingAddressId);
  if (deliveryType == 2 && selectedCountry && selectedCountry != "Germany") {
    error = window.o.i18n("dapps.o-marketplace.molecules.checkoutDelivery.error");
    ("This shop only delivers to Germany. Please select or enter a German Postal Address.");
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
    {#if availableDeliveryMethods}
      <div class="flex flex-row justify-center space-x-4">
        {#each availableDeliveryMethods as dMethod}
          <div class="form-control ">
            <label class="cursor-pointer label">
              <input
                type="radio"
                class=" radio radio-primary radio-sm"
                bind:group="{deliveryType}"
                name="deliveryType"
                value="{dMethod.id}" />
              <span class="pb-2 align-baseline">{dMethod.name}</span>
            </label>
          </div>
        {/each}
      </div>
    {/if}
    <!-- <div class="form-control">
      <label class="cursor-pointer label">
        <input
          type="radio"
          class="radio radio-primary radio-sm"
          checked
          bind:group="{deliveryType}"
          name="deliveryType"
          value="{1}" />
        <span class="inline"><Label key="dapps.o-marketplace.molecules.checkoutDelivery.pickup" /></span>
      </label>
    </div> -->
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
              }}"><Label key="dapps.o-marketplace.molecules.checkoutDelivery.addAddressButton" /></button>
          </div>
        </label>
      </div>
    {:else}
      <div class="flex flex-col mt-4 space-y-2 text-center">
        {#if context.data.shop.pickupAddress}
          <div><Label key="dapps.o-marketplace.molecules.checkoutDelivery.youCanPickupAt" /></div>

          <div class="font-bold">{@html formatShippingAddress(context.data.shop.pickupAddress, true)}</div>
        {/if}
        {#if context.data.shop.openingHours}
          <div class="pt-2"><Label key="dapps.o-marketplace.molecules.checkoutDelivery.openingHours" /></div>

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
