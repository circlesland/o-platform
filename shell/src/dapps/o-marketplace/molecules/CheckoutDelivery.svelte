<script lang="ts">
import { purchase } from "../processes/purchase";

import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { _ } from "svelte-i18n";

export let context: any;

function checkout() {
  window.o.runProcess(purchase, {});
}

let checked: boolean = false;
let balance: number = 0;
let invoiceAmount: number = 0;
let shippingAddressId: number;

let deliveryType: number = 2;

function submit(redirectTo?: string) {
  const answer = new Continue();
  context.data.deliveryMethod = deliveryType === 1;
  console.log("CONTEXT: ", context);
  answer.data = {
    ...context.data,
    redirectTo: redirectTo,
  };
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
          value="{1}" />
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
          value="{2}" />
        <span class="inline"> I want to pick this order up at the store</span>
      </label>
    </div>
  </div>
  {#if deliveryType == 1}
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
              window.o.runProcess(upsertShippingAddress, {});
            }}">Add Address</button>
        </div>
      </label>
    </div>
  {/if}
</div>
<ProcessNavigation on:buttonClick="{() => submit(undefined)}" context="{context}" noSticky="{true}" />

<style>
form {
  display: flex;
  justify-content: center; /* Center on page */
}

.list {
  display: flex;
  flex-wrap: wrap; /* Will cause items/button to go to next line */
}

.item {
  width: 100%;
}
</style>
