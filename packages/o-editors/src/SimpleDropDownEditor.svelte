<script lang="ts">
import { onMount } from "svelte";
import Svelecte, { addFormatter } from "svelecte";
import { EditorContext } from "./editorContext";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { DropdownSelectorContext } from "./DropdownSelectEditorContext";
import ProcessNavigation from "./ProcessNavigation.svelte";

import {
  normalizePromptField,
  PromptField,
} from "@o-platform/o-process/dist/states/prompt";
import {SafeInfo} from "@o-platform/shell/src/shared/api/data/types";

let selected;
let items;
let choices;

export let context: DropdownSelectorContext<any, any, any>;


let field: PromptField<any>;

onMount(async () => {
  field = normalizePromptField(context.field);
  const currentKey = field.get(context);
  if (currentKey) {
    selected = await context.params.choices.byKey(currentKey, context);
  } else {
    selected = undefined;
  }
  console.log("CONTEXT: ", context);
});

$: {
  context = context;
  if (context) {
    context.params.choices.find(null, context)
            .then((c) => {
              choices = c;
              console.log(`Choices: `, c);
            });
  }
  console.log(`Selected:`, selected);
}

function submitHandler() {
  const event = new Continue();
  event.data = {};
  event.data[(<any>field).name] = selected;
  context.data[(<any>field).name] = selected;
  context.process.sendAnswer(event);
}

function itemRenderer(item:SafeInfo, isSelected) {
  let avatar;
  let name;
  if (item.safeProfile) {
    name = item.safeProfile.firstName
      ? item.safeProfile.firstName +
        (item.safeProfile.lastName
          ? " " + item.safeProfile.lastName
          : "")
      : item.safeAddress;
    avatar = item.safeProfile.avatarUrl
      ? item.safeProfile.avatarUrl
      : "/images/market/circles-no-image.jpg";
  } else {
    name = item.safeAddress;
    avatar = "/images/market/circles-no-image.jpg";
  }

  if (isSelected) {
    return `<div
  class="flex items-center w-full p-3 space-x-4 bg-white ">
  <div class="">
    <div class="cursor-pointer has-tooltip">
      <div
        class="self-center text-center rounded-full justify-self-center"
        style="padding: 1px;">
        <div class="w-12 h-12 m-auto bg-white rounded-full">
          <img
            class="w-12 h-12 rounded-full"
            src="${avatar}"
            alt="${name}" />
        </div>
      </div>
    </div>
  </div>
  <div class="flex-col flex-grow">
    <div class="flex flex-row items-center justify-between text-left">
      <div class="flex-grow min-w-0">
        <h2
          class="overflow-hidden text-base whitespace-nowrap overflow-ellipsis">
          ${name}
        </h2>
      </div>
      <div
        class="self-end pl-2 text-right undefined svelte-1vvqort text-success">
        <span></span>
      </div>
    </div>
    <div class="flex flex-row items-center justify-between text-left">
      <div class="flex-grow leading-none">
        <span class="inline-block text-xs text-dark-lightest"
          >${item.safeAddress}</span>
      </div>
      <div
        class="text-xs text-right text-dark-lightest whitespace-nowrap leading-non">
        <div slot="itemCardEndSmallElement"></div>
      </div>
    </div>
  </div>
</div>`;
  }

  return `
  
<div
  class="flex items-center w-full p-3 space-x-4 bg-white ">
  <div class="">
    <div class="cursor-pointer has-tooltip">
      <div
        class="self-center text-center rounded-full justify-self-center"
        style="padding: 1px;">
        <div class="w-12 h-12 m-auto bg-white rounded-full">
          <img
            class="w-12 h-12 rounded-full"
            src="${avatar}"
            alt="${name}" />
        </div>
      </div>
    </div>
  </div>
  <div class="flex-col flex-grow">
    <div class="flex flex-row items-center justify-between text-left">
      <div class="flex-grow min-w-0">
        <h2
          class="overflow-hidden text-base whitespace-nowrap overflow-ellipsis">
          ${name}
        </h2>
      </div>
      <div
        class="self-end pl-2 text-right undefined svelte-1vvqort text-success">
        <span></span>
      </div>
    </div>
    <div class="flex flex-row items-center justify-between text-left">
      <div class="flex-grow leading-none">
        <span class="inline-block text-xs text-dark-lightest"
          >${item.safeAddress}</span>
      </div>
      <div
        class="text-xs text-right text-dark-lightest whitespace-nowrap leading-non">
        <div slot="itemCardEndSmallElement"></div>
      </div>
    </div>
  </div>
</div>
  
  `;
}

addFormatter("itemRenderer", itemRenderer);
</script>

{#if choices}
  <Svelecte
    options="{choices}"
    valueAsObject={true}
    renderer="itemRenderer"
    bind:value="{selected}"
    placeholder="Select Safe" />
{/if}

<ProcessNavigation
  on:buttonClick="{submitHandler}"
  context="{context}"
  noSticky="{true}" />

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
