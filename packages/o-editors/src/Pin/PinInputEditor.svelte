<script lang="ts">
import { EditorContext } from "./../editorContext";
import ProcessNavigation from "./../ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { logout } from "@o-platform/shell/src/dapps/o-passport/processes/logout";
import { identify } from "@o-platform/shell/src/dapps/o-passport/processes/identify/identify2";
// import Pin from "./PinInput.svelte";
import { onMount } from "svelte";
import PincodeInput from "pincode-input";
import "pincode-input/dist/pincode-input.min.css";

export let context: EditorContext;
let _context: EditorContext;

$: {
  _context = context;
}

onMount(() => {
  new PincodeInput(".pincode-input-container", {
    onInput: (value) => {
      _context.data[context.field] = value;
      console.log("VALUE", value);
      if (value.length == 6) {
        submitHandler();
      }
    },
    count: 6,
    secure: true,
    numeric: true,
    previewDuration: 300,
  });

  let inputFields = document.getElementsByClassName("pincode-input");
  if (inputFields) {
    inputFields[0].focus();
  }
});

// let inputField: any;
// let fieldId = context.isSensitive
//   ? Math.random().toString().replace(".", "")
//   : context.field;

const submitHandler = () => {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
};

// function onkeydown(e: KeyboardEvent) {
//   if (e.key == "Enter") {
//     submitHandler();
//   }
// }
</script>

<div class="form-control justify-self-center">
  {#if context.messages[context.field]}
    <div class="mt-2 mb-2 alert alert-error">
      <div class="flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="w-6 h-6 mx-2 stroke-current">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          ></path>
        </svg>
        <label for="input">{context.messages[context.field]} </label>
      </div>
    </div>
  {/if}

  <div class="flex flex-col w-full m-auto">
    <div class="self-center mt-2 pincode-input-container whitespace-nowrap">
    </div>
    <!-- <input
      type="password"
      autofocus
      maxlength="6"
      bind:value="{_context.data[context.field]}"
      on:keydown="{onkeydown}"
      class="simpleinput input input-lg input-bordered"
      inputmode="numeric"
      pattern="[0-9]{6}" /> -->
    <!-- <Pin
      size="{6}"
      bind:pin="{_context.data[context.field]}"
      on:finished="{submitHandler}" /> -->

    <div class="mt-2 text-right">
      <span
        class="mt-4 text-xs link link-primary"
        on:click="{() =>
          window.o.runProcess(logout, {
            successAction: () => {
              window.o.runProcess(identify, { redirectTo: '/home' });
            },
          })}">Forgot your Pin?</span>
    </div>
  </div>

  <ProcessNavigation on:buttonClick="{submitHandler}" context="{context}" />
</div>

<style>
:global(.pincode-input.pincode-input--filled) {
  border-color: #0be09d;
}
:global(.pincode-input.pincode-input--focused) {
  border-color: #41c7f1;
}
:global(.pincode-input) {
  border: 1px solid #d6d6d6;
}

@media (max-width: 640px) {
  :global(.pincode-input:not(:last-child)) {
    margin-right: 0.25rem;
  }
  :global(.pincode-input) {
    width: 45px;
    height: 45px;
    line-height: 45px;
    border-radius: 3px;
    border: 1px solid #d6d6d6;
    text-align: center;
    font-size: 1.5rem;
    text-transform: uppercase;
  }
}
</style>
