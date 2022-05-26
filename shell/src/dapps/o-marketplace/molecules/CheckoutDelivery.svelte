<script lang="ts">
import { purchase } from "../processes/purchase";

import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { _ } from "svelte-i18n";
import { onMount } from "svelte";

export let context: any;

let checked: boolean = false;
let balance: number = 0;
let invoiceAmount: number = 0;
let shippingAddressId: number;
let deliveryType: number = 1;

$: {
  context = context;
}

onMount(() => {
  if (context.data.shop.shop) {
    if (context.data.shop.shop.deliveryMethods === null) {
      deliveryType = 1;
      submit(undefined);
    } else if (context.data.shop.shop.deliveryMethods.length == 1) {
      deliveryType = context.data.shop.shop.deliveryMethods[0].id;
      submit(undefined);
    }
  }
});

function submit(redirectTo?: string) {
  const answer = new Continue();
  context.data.deliveryMethodId = deliveryType;

  answer.data = context.data;

  context.process.sendAnswer(answer);
}

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    submit();
  }
}
</script>

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
  </div>
  {#if deliveryType == 2}
    <div class="form-control">
      <label class="cursor-pointer label">
        <select class="select select-bordered" bind:value="{shippingAddressId}">
          <option value="LIST">Thorsten Schau, Ehrengutstrasse 9</option>
          <option value="TILES">Thorsten Rock c/o Steffi Graf, O-strasse 9, Berlin</option>
        </select>
        <div>
          <button
            class="mt-2 btn btn-sm btn-primary"
            on:click="{() => {
              // window.o.runProcess(upsertShippingAddress, {});
            }}">Add Address</button>
        </div>
      </label>
    </div>
  {/if}
</div>
<ProcessNavigation on:buttonClick="{() => submit(undefined)}" context="{context}" noSticky="{true}" />
