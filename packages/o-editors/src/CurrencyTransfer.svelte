<script lang="ts">
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { CurrencyTransferContext } from "./currencyTransferContext";
import ProcessNavigation from "./ProcessNavigation.svelte";

import circlesIcon from "./dropdownItems/CirclesIcon.svelte";
import xdaiIcon from "./dropdownItems/XdaiIcon.svelte";
import { RpcGateway } from "../../o-circles/dist/rpcGateway";

export let context: CurrencyTransferContext;

let Icon = circlesIcon;
let inputField: any;
let amount: string =
  context.data && context.data.tokens ? context.data.tokens.amount : "";
let maxAmount: string = "0";
let selected = context.data.tokens ? context.data.tokens.currency : "crc";
let selectedCurrency = context.params.currencies.find(
  (o) => o.value === selected
);

$: selectedCurrency = context.params.currencies.find(
  (o) => o.value === selected
);

$: {
  if (selected && context.data.maxFlows) {
    const key = selected.toLowerCase();
    if (context.data.maxFlows[key]) {
      maxAmount = parseFloat(
        RpcGateway.get().utils.fromWei(context.data.maxFlows[key], "ether")
      )
        .toFixed(2)
        .toString();
    }
  }

  if (selectedCurrency && selectedCurrency.value == "crc") {
    Icon = circlesIcon;
  } else if (selectedCurrency && selectedCurrency.value == "xdai") {
    Icon = xdaiIcon;
  }
}

function sendAnswer(amount: string) {
  const event = new Continue();
  event.data = {};
  event.data[context.field] = {
    amount: amount,
    currency: selected,
  };

  context.data[context.field] = selectedCurrency.label;

  context.process.sendAnswer(event);
}

function handleSelect(event) {
  selected = event.detail.value;
}

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    sendAnswer(amount);
  }
}
</script>

<div>
  {#if context.messages[context.field]}
    <div class="mt-2 mb-2 alert alert-error">
      <div class="flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="w-6 h-6 mx-2 stroke-current">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          ></path>
        </svg>
        <label for="input">{context.messages[context.field]} </label>
      </div>
    </div>
  {/if}
  <div class="flex flex-row w-full space-x-2">
    <div class="relative w-full mt-1 rounded-md shadow-sm ">
      <div
        class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
        <span class="text-2xl text-inactive "> € </span>
      </div>
      <input
        type="text"
        name="price"
        id="price"
        class="block w-full pl-8 input input-bordered"
        placeholder="0.00"
        autocomplete="off"
        bind:value="{amount}"
        on:focus
        on:blur
        on:change="{() => (context.editorDirtyFlags[context.field] = true)}"
        bind:this="{inputField}"
        on:keydown="{onkeydown}" />
    </div>
  </div>
  <ProcessNavigation
    on:buttonClick="{() => sendAnswer(amount)}"
    context="{context}" />
</div>
