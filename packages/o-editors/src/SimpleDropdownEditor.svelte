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

let selected;
let items;
let choices;

export let context: DropdownSelectorContext<any, any, any>;

$: selected = {};

let field: PromptField<any>;

$: {
  context = context;
  if (context) {
    context.params.choices.find(null, context).then((c) => (choices = c));
  }
}

function submitHandler() {
  const event = new Continue();
  event.data = {};
  event.data[field.name] = context.params.getKey(selected);
  context.data[field.name] = context.params.getKey(selected);
  context.process.sendAnswer(event);
}

function itemRenderer(item, isSelected) {
  let avatar;
  let name;
  if (item.circlesLandProfile) {
    name = item.circlesLandProfile.firstName
      ? item.circlesLandProfile.firstName +
        (item.circlesLandProfile.lastName
          ? " " + item.circlesLandProfile.lastName
          : "")
      : item.address;
    avatar = item.circlesLandProfile.avatarUrl
      ? item.circlesLandProfile.avatarUrl
      : "/images/market/circles-no-image.jpg";
  } else if (item.circlesGardenProfile) {
    name = item.circlesGardenProfile.name
      ? item.circlesGardenProfile.name
      : item.address;
    avatar = item.circlesGardenProfile.avatar
      ? item.circlesGardenProfile.avatar
      : "/images/market/circles-no-image.jpg";
  } else {
    name = item.address;
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
          >${item.address}</span>
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
          >${item.address}</span>
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
