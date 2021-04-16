<script lang="ts">
  import { Process } from "omo-process/dist/interfaces/process";
  import { Back } from "omo-process/dist/events/back";
  import { Skip } from "omo-process/dist/events/skip";
  import { Continue } from "omo-process/dist/events/continue";

  export let context: {
    process: Process;
    fieldName: string;
    data: {
      [x: string]: any;
    };
    params: {
      label: string;
    };
  };
</script>

&gt; <button on:click={() => context.process.sendAnswer(new Back())}
  >Go back</button
><br />
&gt;
<button
  on:click={() => {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
  }}>Submit</button
><br />
&gt;

<button on:click={() => context.process.sendAnswer(new Skip())}>Skip</button><br
/>
<br />

{#if context.fieldName}
  <h2>{context.params.label}</h2>
  <input
    style="border:solid 1px gray;"
    type="email"
    bind:value={context.data[context.fieldName]}
  /><br />
{:else}
  - not available -
{/if}
