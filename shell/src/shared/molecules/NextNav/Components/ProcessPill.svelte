<script lang="ts">
  import Icons from "./../../Icons.svelte";
  import { Back } from "@o-platform/o-process/dist/events/back";
  import { Skip } from "@o-platform/o-process/dist/events/skip";
  import ActionButtonComponent from "../Components/ActionButton.svelte";
  import { PromptNavigation } from "@o-platform/o-process/dist/events/prompt";

  export let isOpen: boolean = false;
  export let modalProcess: any;
  export let navigation: any;
  export let lastPrompt: any;
  export let processNavigation: PromptNavigation;
  console.log("NAVIGATION: ", processNavigation);
</script>

<div
  class="w-auto h-8 col-start-2 place-self-center processPill"
  class:pl-2={lastPrompt && lastPrompt.navigation.canGoBack}
  class:pr-2={lastPrompt && lastPrompt.navigation.canSkip}
>
  <div class="grid grid-cols-3 justify-items-center processPillGrid">
    {console.log("LASTPOR: ", lastPrompt)}
    {#if lastPrompt && lastPrompt.navigation.canGoBack}
      <div
        class="w-20 h-8 px-3 py-2 bg-white rounded-full cursor-pointer text-lightdark"
        on:click={() => modalProcess.sendAnswer(new Back())}
      >
        back
      </div>
    {/if}
    <div class="z-50 w-12 col-start-2 cursor-pointer">
      <ActionButtonComponent {isOpen} on:actionButton />
    </div>
    {#if lastPrompt && lastPrompt.navigation.canSkip}
      <div
        class="w-20 h-8 py-2 bg-white rounded-full cursor-pointer px-9 text-lightdark"
        on:click={() => modalProcess.sendAnswer(new Skip())}
      >
        skip
      </div>
    {/if}
  </div>
</div>
