<script lang="ts">
import { onMount } from "svelte";
import Svelecte, { addFormatter } from "svelecte";
import { EditorContext } from "./editorContext";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { DropdownSelectorContext } from "./DropdownSelectEditorContext";
import {
  normalizePromptField,
  PromptField,
} from "@o-platform/o-process/dist/states/prompt";

let selected;
let items;

export let context: DropdownSelectorContext<any, any, any>;

onMount(async () => {
  items = await context.params.choices.all();

  console.log("ITEMS: ", items);
});

$: selected = {};

let inputField: any;
let _context: EditorContext;

let field: PromptField<any>;

let fieldId = context.isSensitive
  ? Math.random().toString().replace(".", "")
  : context.field;

$: {
  _context = context;
  console.log("Choices: ", context.params.choices);
}

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

function itemRenderer(item, isSelected) {
  console.log("item", item);

  return `<svelte:component this="${context.params.itemTemplate}" item="${item}"/>`;
}

addFormatter("itemRenderer", itemRenderer);
</script>

<Svelecte
  options="{items}"
  renderer="itemRenderer"
  bind:value="{selected}"
  placeholder="{context.params.view.placeholder}" />

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
</style>
