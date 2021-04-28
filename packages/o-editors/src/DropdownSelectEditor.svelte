<script lang="ts">
  import Select from "svelte-select";
  import { ChoiceSelectorContext } from "./choiceSelectorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { onMount } from "svelte";
  import Item from "./DropdownSelectItem.svelte";

  export let context: ChoiceSelectorContext;

  $: selected = {};
  let selectedLabel: String;

  let graphql = false;
  let optionIdentifier = "value";
  let getOptionLabel = (option) => option.label;
  let getSelectionLabel = (option) => option.label;

  onMount(() => {
    graphql = context.params.graphql;
    getOptionLabel = context.params.getOptionLabel
      ? context.params.getOptionLabel
      : getOptionLabel;
    getSelectionLabel = context.params.getSelectionLabel
      ? context.params.getSelectionLabel
      : getSelectionLabel;

    if (graphql) {
      selected = context.data[context.fieldName];
    } else {
      selected = context.params.choices.find(
        (o) => o.value === context.data[context.fieldName]
      );
    }
  });

  function handleSelect(event) {
    selected = event.detail;
    selectedLabel = event.detail.label;
  }

  export function handleClear() {
    selected = undefined;
  }

  function submitHandler() {
    const event = new Continue();
    event.data = {};
    event.data[context.fieldName] = selected.value;
    context.data[context.fieldName] = selected.value;
    context.process.sendAnswer(event);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      submitHandler();
    }
  }
</script>

<div class="form-control justify-self-center">
  <div class="dropdown-select-editor flex flex-wrap content-end w-full">
    <div class="w-full">
      <label class="label" for={context.fieldName}>
        <span class="label-text">{context.params.label}</span>
      </label>
    </div>

    {#if !!context.params.asyncChoices}
      <div class="themed">
        <Select
          name="value"
          selectedValue={selected}
          loadOptions={context.params.asyncChoices}
          placeholder="Search..."
          listAutoWidth={false}
          listPlacement="top"
          containerClasses="w-80 min-w-full asyncList"
          isCreatable={true}
          on:clear={handleClear}
          {optionIdentifier}
          {getSelectionLabel}
          {getOptionLabel}
          {Item}
          on:select={handleSelect}
        />
      </div>
    {:else}
      <div class="themed-select">
        <Select
          name="value"
          selectedValue={selected}
          items={context.params.choices}
          showChevron={true}
          listAutoWidth={false}
          listPlacement="top"
          containerClasses="w-80 min-w-full"
          on:select={handleSelect}
        />
      </div>
    {/if}
    {#if context.messages[context.fieldName]}
      <label class="label text-right" for="form-error">
        <span id="form-error" class="label-text-alt text-error "
          >{context.messages[context.fieldName]}</span
        >
      </label>
    {/if}
  </div>
</div>
<ProcessNavigation on:buttonClick={submitHandler} {context} />

<style>
  .dropdown-select-editor {
    --listMaxHeight: 400px;
    --listMaxWidth: 10rem;
  }
  .themed {
    width: 100%;
    --listBackground: transparent;
    --listShadow: none;
    --borderRadius: 0;
    --border: none;
    --height: 3.5rem;
    --inputTop: 3px;
    --inputFontSize: 18px;
    --inputPadding: 0.75rem 0.5rem 0.5rem 0.25rem;

    @apply input input-lg input-bordered;
  }
  .themed-select {
    width: 100%;
    --borderRadius: 0;
    --border: none;
    --height: 3.5rem;
    --inputTop: 3px;
    --inputFontSize: 18px;
    --inputPadding: 0.75rem 0.5rem 0.5rem 0.25rem;

    @apply input input-lg input-bordered;
  }
</style>
