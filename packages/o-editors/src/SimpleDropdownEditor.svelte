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

export let context: DropdownSelectorContext<any, any, any>;

$: selected = {};

let inputField: any;
let _context: EditorContext;

let field: PromptField<any>;

let fieldId = context.isSensitive
  ? Math.random().toString().replace(".", "")
  : context.field;

$: {
  _context = context;
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
const items = [
  { value: "chocolate", label: "🍫 Chocolate", group: "Sweet" },
  { value: "pizza", label: "🍕 Pizza", group: "Savory" },
  { value: "cake", label: "🎂 Cake", group: "Sweet" },
  { value: "cookies", label: "🍪 Cookies", group: "Savory" },
  { value: "ice-cream", label: "🍦 Ice Cream", group: "Sweet" },
];
</script>

<Svelecte options="{items}" bind:value="{selected}" />
