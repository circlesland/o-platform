<script lang="ts">
  // import Select from "../../../shell/src/shared/molecules/Select/Select.svelte";
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
    context.editorDirtyFlags[context.fieldName] = true;
  }

  export function handleClear() {
    selected = undefined;
    context.editorDirtyFlags[context.fieldName] = true;
  }

  function submitHandler() {
    const event = new Continue();
    event.data = {};
    event.data[context.fieldName] = selected.value;
    context.data[context.fieldName] = selected.value;
    context.process.sendAnswer(event);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key == "Enter" && selected && selected.value) {
      submitHandler();
    }
  }
</script>

<div
  class="flex flex-col items-end form-control justify-self-center"
  style="height: 29rem"
>
  <label
    class="self-center flex-1 mb-4 text-center label"
    for={context.fieldName}
  >
    <span class="label-text">{@html context.params.label}</span>
  </label>

  {#if !!context.params.asyncChoices}
    <div class="themed" on:keydown={onkeydown}>
      <Select
        name="value"
        isFocused={true}
        selectedValue={selected}
        loadOptions={context.params.asyncChoices}
        noOptionsMessage=""
        placeholder="Search..."
        listAutoWidth={false}
        listPlacement="top"
        containerClasses="min-w-full asyncList  max-w-xs"
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
        isFocused={true}
        selectedValue={selected}
        items={context.params.choices}
        showChevron={true}
        listAutoWidth={false}
        listPlacement="top"
        containerClasses="min-w-full max-w-xs"
        on:select={handleSelect}
      />
    </div>
  {/if}
  {#if context.messages[context.fieldName]}
    <label class="text-right label" for="form-error">
      <span id="form-error" class="label-text-alt text-error "
        >{context.messages[context.fieldName]}</span
      >
    </label>
  {/if}
</div>
<ProcessNavigation on:buttonClick={submitHandler} {context} />

<!-- <style>
  .themed {
    width: 100%;
    padding: 0 !important;
    --listMaxHeight: 400px;
    --padding: 0;

    --listBackground: transparent;
    --listShadow: none;
    --borderRadius: var(--rounded-btn, 0.5rem);
    --border: 1px solid hsla(var(--bc, 215 28% 17%) / var(--tw-border-opacity));

    @apply input-lg;
    --height: auto;
    height: auto !important;
    min-height: 4rem;
    --inputTop: 3px;
    --inputFontSize: 18px;
    --inputPadding: 0.5rem 0.5rem 0.5rem 1rem;
  }
  .themed-select {
    padding: 0 !important;
    --listMaxHeight: 400px;
    --listMaxWidth: 10rem;
    width: 100%;
    --borderRadius: var(--rounded-btn, 0.5rem);
    --border: 1px solid hsla(var(--bc, 215 28% 17%) / var(--tw-border-opacity));
    --height: 4rem;
    --inputTop: 3px;
    --inputFontSize: 18px;
    --inputPadding: 0.5rem 0.5rem 0.5rem 1rem;
    height: 3.5rem;
    @apply input-lg;
  }
</style> -->
<style>
  .themed {
    width: 100%;
    padding: 0 !important;
    --listMaxHeight: 400px;
    /* --listMaxWidth: 10rem; */
    --listBackground: transparent;
    --listShadow: none;
    --borderRadius: var(--rounded-btn, 0.5rem);
    --border: 1px solid hsla(var(--bc, 215 28% 17%) / var(--tw-border-opacity));
    --height: 4rem;
    --inputTop: 3px;
    --inputFontSize: 18px;
    --inputPadding: 0.5rem 0.5rem 0.5rem 1rem;
    --itemIsActiveBG: #dddddd;
    --itemIsActiveColor: #001c6e;
    height: 3.5rem;
    @apply input-lg;
    @apply input-bordered;
  }

  .themed-select {
    padding: 0 !important;
    --listMaxHeight: 400px;
    --listMaxWidth: 10rem;
    width: 100%;
    --borderRadius: var(--rounded-btn, 0.5rem);
    --border: 1px solid hsla(var(--bc, 215 28% 17%) / var(--tw-border-opacity));
    --height: 4rem;
    --inputTop: 3px;
    --inputFontSize: 18px;
    --inputPadding: 0.5rem 0.5rem 0.5rem 1rem;
    --itemIsActiveBG: #dddddd;
    --itemIsActiveColor: #001c6e;
    height: 3.5rem;
    @apply input-lg;
    @apply input-bordered;
  }
</style>
