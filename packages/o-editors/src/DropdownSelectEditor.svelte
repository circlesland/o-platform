<script lang="ts">
import Select from "../../../shell/src/shared/molecules/Select/Select.svelte";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";
import Item from "./DropdownSelectItem.svelte";
import {
  normalizePromptField,
  PromptField,
} from "@o-platform/o-process/dist/states/prompt";
import { DropdownSelectorContext } from "./DropdownSelectEditorContext";

/*
 * allow arbitrary values in dropdownselecteditor
 * allow to add new tags in dropdownselecteditor
 * add a "most-recent" list to the dropdownselecteditor
 */

export let context: DropdownSelectorContext<any, any>;

$: selected = {};

let selectComponent: Select;
let field: PromptField<any>;
let filterText: string;

$: {
}

onMount(async () => {
  field = normalizePromptField(context.field);
  const currentKey = field.get(context);
  if (currentKey) {
    selected = await context.params.choices.byKey(currentKey);
  } else {
    selected = undefined;
    if (context.params.showResultsOnLoad) {
      filterText = "0x";
      setTimeout(() => {
        filterText = "";
        selectComponent.getItems();
      }, 1);
    }
  }
});

function handleSelect(event) {
  selected = event.detail;
  context.editorDirtyFlags[field.name] = true;
}

export function handleClear() {
  selected = undefined;
  context.editorDirtyFlags[field.name] = true;
}

function submitHandler() {
  const event = new Continue();
  console.log("CONTEXT: ", context);
  event.data = {};
  event.data[field.name] = context.params.getKey(selected);
  context.data[field.name] = context.params.getKey(selected);
  context.process.sendAnswer(event);
}

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter" && selected) {
    submitHandler();
  }
}
</script>

{#if field}
  <div class="flex flex-col items-end form-control justify-self-center">
    <div class="text-base themed">
      <Select
        name="searchTerm"
        autoComplete="off"
        isFocused="{true}"
        selectedValue="{selected}"
        loadOptions="{(searchString) =>
          context.params.choices.find(searchString, context)}"
        noOptionsMessage=""
        placeholder="Search..."
        listAutoWidth="{false}"
        inlineSubmit="{true}"
        listPlacement="top"
        containerClasses="min-w-full asyncList  max-w-xs"
        on:clear="{handleClear}"
        optionIdentifier="{context.params.keyProperty}"
        getSelectionLabel="{context.params.getLabel}"
        getOptionLabel="{context.params.getLabel}"
        Item="{context.params.itemTemplate
          ? context.params.itemTemplate
          : Item}"
        on:select="{handleSelect}"
        bind:this="{selectComponent}"
        bind:filterText
        on:buttonClick="{submitHandler}" />
    </div>
    {#if context.messages[context.field]}
      <label class="text-right label" for="form-error">
        <span id="form-error" class="label-text-alt text-error"
          >{context.messages[context.field]}</span>
      </label>
    {/if}
  </div>
{/if}

<!-- <ProcessNavigation on:buttonClick={submitHandler} {context} type="small" /> -->
<style>
.themed {
  width: 100%;
  padding: 0 !important;
  --listMaxHeight: 19rem;
  --listBackground: transparent;
  --listShadow: none;
  --borderRadius: var(--rounded-btn, 0.5rem);
  --border: 1px solid hsla(var(--bc, 215 28% 17%) / var(--tw-border-opacity));
  --height: auto;
  --inputTop: 3px;
  --inputFontSize: 18px;
  --inputPadding: 0.5rem 0.5rem 0.5rem 1rem;
  --itemHoverBG: "#cccccc";
  --clearSelectTop: 3.25rem;
  --clearSelectHeight: 2.5rem;
  --clearSelectRight: 4.5rem;
  height: auto;
}
</style>
