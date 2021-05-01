<script lang="ts">
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { CurrencyTransferContext } from "./currencyTransferContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import Select from "svelte-select";
  import Item from "./DropdownCurrencyItem.svelte";
  import { RpcGateway } from "../../o-circles/dist/rpcGateway";

  export let context: CurrencyTransferContext;

  console.log("CONTEXT", context);
  let amount: string =
    context.data && context.data.tokens ? context.data.tokens.amount : "";
  let maxAmount: string = "0";
  $: selectedCurrency = context.params.currencies.find(
    (o) => o.value === "crc"
  );
  $: selected = "CRC";
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
      placeholder="0.00 (Max: {maxAmount})"
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
    </div>
  </div>
  {#if context.messages[context.fieldName]}
    <label class="label text-right" for="form-error">
      <span id="form-error" class="label-text-alt text-error "
        >{context.messages[context.fieldName]}</span
      >
    </label>
  {/if}

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
