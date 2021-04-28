<script lang="ts">
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { CurrencyTransferContext } from "./currencyTransferContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import Select from "svelte-select";
  import Item from "./DropdownCurrencyItem.svelte";

  export let context: CurrencyTransferContext;

  let amount: string = "0";
  $: selectedCurrency = context.params.currencies.find(
    (o) => o.value === "crc"
  );
  $: selected = "CRC";

  function sendAnswer(amount: string) {
    const event = new Continue();
    event.data = {};
    event.data[context.fieldName] = {
      amount: amount,
      currency: selected,
    };

    context.data[context.fieldName] = selectedCurrency.label;

    context.process.sendAnswer(event);
  }

  function handleSelect(event) {
    selected = event.detail.value;
  }
</script>

<p class="label-text">
  {context.params.label}
</p>
<div class="flex flex-col w-full">
  <div class="mt-1 relative rounded-md w-full shadow-sm">
    <div
      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
    >
      <span class="text-base-300 sm:text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 m-auto"
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
      class="input input-bordered block w-full pl-12 pr-12 sm:text-sm "
      placeholder="0.00"
      bind:value={amount}
    />
    <div class="absolute inset-y-0 right-1 flex items-center themed">
      <label for="currency" class="sr-only">Currency</label>
      <Select
        name="currency"
        selectedValue={selectedCurrency}
        items={context.params.currencies}
        showIndicator={true}
        listAutoWidth={false}
        listPlacement="top"
        isClearable={false}
        containerClasses="w-34 min-w-full rounded-md"
        {Item}
        on:select={handleSelect}
      />
      <!-- <select
        id="currency"
        name="currency"
        class=" h-full py-0 pl-2 mr-1 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
        bind:value={selectedCurrency}
      >
        {#each context.params.currencies as currency}
          <option label={currency.label} value={currency.key}
            >{currency.label}</option
          >
        {/each}
      </select> -->
    </div>
  </div>

  <ProcessNavigation
    on:buttonClick={() => sendAnswer(amount, selectedCurrency)}
    {context}
  />
</div>

<style>
  .themed {
    --borderRadius: 5px;
    --indicatorTop: 7px;
  }
</style>
