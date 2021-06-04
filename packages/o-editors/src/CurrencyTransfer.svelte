<script lang="ts">
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { CurrencyTransferContext } from "./currencyTransferContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import Select from "svelte-select";
  import Item from "./DropdownCurrencyItem.svelte";
  import { RpcGateway } from "../../o-circles/dist/rpcGateway";
  import { onMount } from "svelte";
  export let context: CurrencyTransferContext;

  let inputField: any;
  let amount: string =
    context.data && context.data.tokens ? context.data.tokens.amount : "";
  let maxAmount: string = "0";
  let selected = context.data.tokens ? context.data.tokens.currency : "crc";
  let selectedCurrency = context.params.currencies.find(
    (o) => o.value === "crc"
  );
  onMount(() => inputField.focus());

  $: selectedCurrency = context.data.tokens
    ? context.data.tokens.currency
    : context.params.currencies.find((o) => o.value === selected);

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

<p class="label-text">
  {context.params.label}
</p>
{#if context.messages[context.field]}
  <div class="mt-2 mb-2 alert alert-error">
    <div class="flex-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="w-6 h-6 mx-2 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        />
      </svg>
      <label for="input">{context.messages[context.field]} </label>
    </div>
  </div>
{/if}
<div class="flex flex-col w-full">
  <div class="relative w-full mt-1 rounded-md shadow-sm">
    <div
      class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
    >
      <span class="text-base-300 sm:text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 m-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </span>
    </div>
    <input
      type="text"
      name="price"
      id="price"
      class="block w-full pl-12 pr-12 input input-bordered sm:text-sm "
      placeholder="0.00 (Max: {maxAmount})"
      autocomplete="off"
      bind:value={amount}
      on:change={() => (context.editorDirtyFlags[context.field] = true)}
      bind:this={inputField}
      on:keydown={onkeydown}
    />
    <div class="absolute inset-y-0 flex items-center right-1 themed">
      <label for="currency" class="sr-only">Currency</label>
      <Select
        name="currency"
        selectedValue={selectedCurrency}
        items={context.params.currencies}
        showIndicator={true}
        listAutoWidth={false}
        listPlacement="top"
        isClearable={false}
        containerClasses="w-24 min-w-full rounded-md"
        {Item}
        on:select={handleSelect}
        on:change={() => (context.editorDirtyFlags[context.field] = true)}
      />
    </div>
  </div>

  <ProcessNavigation on:buttonClick={() => sendAnswer(amount)} {context} />
</div>

<style>
  .themed {
    --borderRadius: 5px;
    --indicatorTop: 7px;
  }

</style>
