<script lang="ts">
import Select from "../../../shell/src/shared/molecules/Select/Select.svelte";
import ProcessNavigation from "./ProcessNavigation.svelte";
import Svelecte, { addFormatter } from "svelecte";
import { EditorContext } from "./editorContext";
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

export let context: DropdownSelectorContext<any, any, any>;

$: selected = {};

let inputField: any;
let _context: EditorContext;
let selectComponent: Select;
let field: PromptField<any>;
let filterText: string;
let showSafeAddressInput: boolean = false;
let fieldId = context.isSensitive
  ? Math.random().toString().replace(".", "")
  : context.field;

$: {
  _context = context;
}

onMount(async () => {
  field = normalizePromptField(context.field);
  const currentKey = field.get(context);
  if (currentKey) {
    selected = await context.params.choices.byKey(currentKey, context);
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
  console.log("CONTEXT: ", context);
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

const submitSafeAddressInput = () => {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
};

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter" && selected) {
    submitHandler();
  }
}
function toggleInputView() {
  showSafeAddressInput = !showSafeAddressInput;
}
const items = [
  { value: "chocolate", label: "🍫 Chocolate", group: "Sweet" },
  { value: "pizza", label: "🍕 Pizza", group: "Savory" },
  { value: "cake", label: "🎂 Cake", group: "Sweet" },
  { value: "cookies", label: "🍪 Cookies", group: "Savory" },
  { value: "ice-cream", label: "🍦 Ice Cream", group: "Sweet" },
];

let resetOnBlur = true;
let fetchResetOnBlur = true;
let value = "";
let selection = "";

function colorRenderer(item, isSelected) {
  console.log("item", item);
  if (isSelected) {
    return `<section
  class="flex items-center justify-center mb-4 mr-1 border rounded-sm shadow-sm customItem">
  <div
    class="flex items-center w-full px-3 pt-1 space-x-2 sm:space-x-6 item-body ">
    <div class="text-center">
      <div class="inline-flex">
        <div class="w-10 h-10 m-auto rounded-full">
          <img
            class="rounded-full"
            src="${item.avatarUrl ? item.avatarUrl : "/images/market/city.png"}"
            alt="user-icon" />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="max-w-full -mt-1 leading-8 cursor-pointer ">
        ${item.firstName} ${item.lastName ? item.lastName : ""}
      </div>
    </div>
  </div>
</section>`;
  }
  return `
    <section
  class="flex items-center justify-center mb-4 mr-1 border rounded-sm shadow-sm customItem">
  <div
    class="flex items-center w-full px-3 pt-1 space-x-2 sm:space-x-6 item-body ">
    <div class="text-center">
      <div class="inline-flex">
        <div class="w-10 h-10 m-auto rounded-full">
          <img
            class="rounded-full"
            src="${item.avatarUrl ? item.avatarUrl : "/images/market/city.png"}"
            alt="user-icon" />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="max-w-full -mt-1 leading-8 cursor-pointer ">
        ${item.firstName} ${item.lastName ? item.lastName : ""}
      </div>
    </div>
  </div>
</section>`;
}
// add custom renderer
addFormatter("color-blocks", colorRenderer);
// alternatively you can use object syntax
addFormatter({
  "color-blocks": colorRenderer,
});
</script>

<Svelecte
  options="{[]}"
  resetOnBlur="{resetOnBlur}"
  clearable="{true}"
  fetchResetOnBlur="{fetchResetOnBlur}"
  bind:readSelection="{selection}"
  bind:value
  renderer="color-blocks"
  valueAsObject
  minQuery="{1}"
  placeholder="Start typing ('da' for example)"
  fetch="{(selection) => context.params.choices.find(selection, context)}" />

<!-- 
{#if field}
  <div class="flex flex-col items-end form-control justify-self-center">
    <div class="h-12 text-base themed">
      {#if showSafeAddressInput}
        <div
          class="flex flex-row items-start space-x-4 form-control justify-self-center"
          style="margin-bottom: 1.4rem;">
          <input
            on:keydown="{onkeydown}"
            id="{fieldId}"
            name="{fieldId}"
            autocomplete="{fieldId}"
            type="text"
            placeholder="Enter Safe Address"
            class="flex-grow h-12 input input-lg input-bordered"
            class:input-error="{context.messages[context.field]}"
            bind:value="{_context.data[context.field]}"
            on:focus
            on:blur
            on:change="{() =>
              (context.editorDirtyFlags[context.field] = true)}" />
          <div>
            <ProcessNavigation
              on:buttonClick="{submitSafeAddressInput}"
              context="{context}"
              type="small" />
          </div>
        </div>
      {:else}
        <Select
          name="searchTerm"
          autoComplete="off"
          isFocused="{false}"
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
      {/if}
      {#if context.params.allowAlternativeInput}
        <div
          class="absolute text-xs text-right cursor-pointer text-primary left-16"
          style="z-index: 999999999999; right: 5.5rem; bottom: 0.2rem;"
          on:click="{toggleInputView}">
          {showSafeAddressInput
            ? "Click to search for Circles Profile"
            : "Click to enter Circles Safe Address"}
        </div>
      {/if}
    </div>
    {#if context.messages[context.field]}
      <label class="text-right label" for="form-error">
        <span id="form-error" class="label-text-alt text-error"
          >{context.messages[context.field]}</span>
      </label>
    {/if}
  </div>
{/if} -->

<!-- <ProcessNavigation on:buttonClick={submitHandler} {context} type="small" /> -->
<style>
:global(.sv-dropdown) {
  position: static !important;
  bottom: 100%;
  order: 1;
  max-height: fit-content !important;
}
:global(.sv-control) {
  order: 2;
  width: 100%;
  position: sticky;
  z-index: 999999999999;
  bottom: 1rem;
  background: white;
}
:global(.svelecte) {
  flex: 1 1 auto;
  display: flex;
  flex-flow: column;
  margin-bottom: 1.5rem;
  position: static !important;
}
:global(.sv-content > div) {
  flex-grow: 1;
}

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
