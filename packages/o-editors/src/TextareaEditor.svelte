<script lang="ts">
  import { EditorContext } from "./editorContext";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";
  import { onMount } from "svelte";
  import UAParser from "ua-parser-js";
  import CopyClipBoard from "../../../shell/src/shared/atoms/CopyClipboard.svelte";

  const uaParser = new UAParser();

  export let context: EditorContext;

  let _context: EditorContext;
  let length;

  $: {
    _context = context;
    length = _context.data[context.field]
      ? _context.data[context.field].length
      : 0;
  }

  let inputField: any;
  let maxlength: string = context.params.maxLength
    ? context.params.maxLength
    : "500";

  const submitHandler = () => {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
  };

  var autoExpand = function () {
    var el = this;
    setTimeout(function () {
      el.style.cssText = "height:auto; padding:0 padding-top: 2px;";
      el.style.cssText = "height:" + el.scrollHeight + "px";
    }, 0);
  };

  /* trim input and set dirty flag */
  const validateFormatting = () => {
    context.editorDirtyFlags[context.field] = true;
    _context.data[context.field] = _context.data[context.field].trim();
  };

  onMount(() => {
    let textarea = document.querySelector("textarea");
    textarea.addEventListener("input", autoExpand);
    let detectedDevice = uaParser.getDevice();
    if (length > 17) {
      textarea.dispatchEvent(new Event("input"));
    }
    if (detectedDevice && detectedDevice.type) {
      if (detectedDevice.type != "mobile") {
        inputField.focus();
      }
    } else {
      inputField.focus();
    }
  });

  const copy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: { name: context.data[context.field] },
    });
    app.$destroy();
  };
</script>

<div class="p-4 form-control justify-self-center">
  <label class="label" for={context.field}>
    <div class="label-text">{@html context.params.label}</div>
    {#if context.params.canCopy}
      <div class="inline-block text-xs break-all" id="clipboard">
        <input
          name="name"
          type="text"
          class="hidden"
          bind:value={_context.data[context.field]}
        />
        <div
          class="relative flex text-xs text-gray-300 cursor-pointertext-center -bottom-1"
          on:click={copy}
          alt="Copy to Clipboard"
        >
          Copy to Clipboard
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ml-2 h-5 w-5 stroke-current transform group-hover:rotate-[-4deg] transition"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
      </div>
    {/if}
  </label>

  {#if context.messages[context.field]}
    <div class="mt-2 mb-2 alert alert-error">
      <div class="flex-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="w-6 h-6 mx-2 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        <label for="input">{context.messages[context.field]} </label>
      </div>
    </div>
  {/if}
  <textarea
    readonly={context.isReadonly ? "readonly" : ""}
    {maxlength}
    name="input"
    rows="1"
    id={context.field}
    type="text"
    placeholder={context.params.placeholder}
    class="overflow-hidden textarea textarea-bordered"
    class:input-error={context.messages[context.field]}
    bind:value={_context.data[context.field]}
    bind:this={inputField}
    on:change={validateFormatting}
  />
  {#if !context.params.hideCharacterCount}
    <p class="relative right-0 text-xs text-right text-white top-2">
      {length}/{maxlength} Characters. {length > maxlength
        ? "Oops, please enter a maximum of " + maxlength + " characters."
        : ""}
    </p>
  {/if}

  <ProcessNavigation on:buttonClick={submitHandler} {context} />
</div>

<style>
  textarea {
    font-size: 1.125rem;
    line-height: 2rem;
  }
</style>
