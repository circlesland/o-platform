<script lang="ts">
  import { Offer } from "../data/api/types";
  import { me } from "../../../shared/stores/me";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { upsertOffer } from "../processes/upsertOffer";

  export let offer: Offer;
  export let field: {
    key: string;
    title: string;
    displayName?: (offer: Offer) => string;
  };

  export let allowEdit: boolean = false;
  let isEditable: boolean = false;
  $: {
    isEditable =
      allowEdit && $me && offer && $me.id == offer.createdByProfileId;
  }

  function edit(dirtyFlags: { [field: string]: boolean }) {
    console.log("edit: dirtyFlags:", dirtyFlags);

    window.o.runProcess({
      id: upsertOffer.id,
      name: upsertOffer.name,
      stateMachine: (processId?: string) =>
        (<any>upsertOffer).stateMachine(processId, true),
    }, offer, dirtyFlags);
  }

</script>

<div class="mb-4 text-sm text-left text-primary">
  {#if field && offer && offer[field.key]}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="inline w-4 h-4 -mt-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
    {field.title}:
    <span class="inline text-dark"
      >{field.displayName ? field.displayName(offer) : offer[field.key]}</span
    >
    {#if isEditable}
      <button
        class="link link-primary text-primary text-2xs"
        on:click={() => edit({ [field.key]: true })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 h-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
          />
        </svg>
      </button>
    {/if}
    <br />
  {/if}
</div>
