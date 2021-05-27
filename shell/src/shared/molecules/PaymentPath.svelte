<script lang="ts">
  import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
  import {Continue} from "@o-platform/o-process/dist/events/continue";
  import {PaymentPathContext} from "./paymentPathContext";
  import CirclesTransferGraph from "../pathfinder/CirclesTransferGraph.svelte";

  export let context: PaymentPathContext;

  function submit() {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      submit();
    }
  }
</script>

{#if context.messages[context.fieldName]}
  <div class="alert alert-error mb-2 mt-2">
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
      <label for="input">{context.messages[context.fieldName]} </label>
    </div>
  </div>
{/if}
<div class="label-text">
  <CirclesTransferGraph transfers={context.params.transfers}/>
</div>
<ProcessNavigation on:buttonClick={submit} {context} />
