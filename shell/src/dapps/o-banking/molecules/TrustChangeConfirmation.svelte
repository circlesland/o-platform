<script lang="ts">
import { Continue } from "@o-platform/o-process/dist/events/continue";
import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import UserImage from "src/shared/atoms/UserImage.svelte";
import { _ } from "svelte-i18n";

export let context: any;
let _context: any;

$: {
  _context = context;
}

function submit() {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
}
</script>

{#if _context.data && _context.data.profile}
  <div
    class="flex flex-col items-center self-center w-full m-auto space-y-4 text-center justify-self-center">
    <UserImage
      profile="{_context.data.profile[0]}"
      size="{36}"
      gradientRing="{true}" />

    <div>
      <span class="mt-4 text-xl">
        {#if _context.data.trustLimit == 100}
          You trust {_context.data.profile[0].displayName} now
        {:else}
          You removed your trust to {_context.data.profile[0].displayName}
        {/if}
      </span>
    </div>
  </div>
  <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
{/if}
