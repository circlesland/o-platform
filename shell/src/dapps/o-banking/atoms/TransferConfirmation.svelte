<script lang="ts">
import { onMount } from "svelte";
import Time from "svelte-time";
import UserImage from "src/shared/atoms/UserImage.svelte";
import { me } from "../../../shared/stores/me";

import CirclesTransferGraph from "../../../shared/pathfinder/CirclesTransferGraph.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { loadProfile } from "../../../shared/functions/loadProfile";

import Icons from "../../../shared/molecules/Icons.svelte";
import { Currency } from "../../../shared/currency";

export let context: any;
let _context: any;
let profile: any;

$: {
  _context = context;
}

onMount(async () => {
  profile = await loadProfile(context.data.recipientAddress, $me);
  //   console.log(
  //     "loadProfile2: ",
  //     (profile = await loadProfile(context.data.recipientAddress, $me))
  //   );
});

let classes: string;
let now = new Date();

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

{#if _context.data && profile}
  <div
    class="flex flex-col items-center self-center w-full m-auto space-y-4 text-center justify-self-center">
    <div>
      <span class="inline-block text-6xl font-heading {classes}">
        {_context.data.tokens.amount} <span class=" font-primary">€</span>
      </span>
      <div class="font-xs">
        {_context.data.tokens.amount * 10}
        <span class=" font-primary">{Currency.currencySymbol["TIME_CRC"]}</span>
      </div>
    </div>

    <UserImage profile="{profile.profile}" size="{36}" gradientRing="{true}" />

    <div>
      <span class="mt-4 text-xl">
        to {profile.profile.firstName + " " + profile.profile.lastName}
      </span>
    </div>
    <div class="text-dark-lightest">
      {_context.data.message && _context.data.message != undefined
        ? _context.data.message
        : ""}
    </div>

    {#if _context.data && _context.data.transitivePath}
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          Payment Path
        </div>
        <div class="flex items-center w-full">
          <CirclesTransferGraph
            transfers="{_context.data.transitivePath.transfers}"
            height="70px"
            onWhiteBackground="{true}" />
        </div>
      </div>
    {/if}
    <div class="flex flex-col w-full space-y-1">
      <div class="mb-1 text-left text-2xs text-dark-lightest">Date</div>

      <div class="flex items-center w-full">
        <div class="text-left ">
          <Time timestamp="{now}" format="D. MMMM YYYY HH:mm" />
        </div>
      </div>
    </div>

    <!-- <div class="flex flex-col w-full space-y-1">
      <div class="mb-1 text-left text-2xs text-dark-lightest">Amount</div>

      <div class="flex items-center w-full">
        <div class="text-left ">
          {_context.data.tokens.amount}
          {#if _context.data.tokens.currency == "crc"}
            Circles
          {:else}
            xDai
          {/if}
        </div>
      </div>
    </div> -->

    <div class="flex flex-col w-full space-y-1">
      <div class="mb-1 text-left text-2xs text-dark-lightest">
        Recipient Address
      </div>

      <div class="flex items-center w-full">
        <div class="text-left break-all">{profile.profile.circlesAddress}</div>
      </div>
    </div>
  </div>
  <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
{/if}
