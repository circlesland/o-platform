<script lang="ts">
import { onMount } from "svelte";
import Time from "svelte-time";
import UserImage from "src/shared/atoms/UserImage.svelte";
import { me } from "../../../shared/stores/me";
import {
  displayCirclesAmount,
  convertTimeCirclesToCircles,
} from "../../../shared/functions/displayCirclesAmount";
import CirclesTransferGraph from "../../../shared/pathfinder/CirclesTransferGraph.svelte";
import {
  CrcHubTransfer,
  CrcMinting,
  Profile,
} from "../../../shared/api/data/types";
import { loadProfile } from "../../../shared/functions/loadProfile";

import { now } from "svelte/internal";
import XDaiDetail from "../pages/XDaiDetail.svelte";

export let context: any;
let _context: any;
let profile: any;

let titleColorClass = context.params.view.titleColor
  ? context.params.view.titleColor
  : "";
$: {
  _context = context;
}
console.log("Params: ", context);
onMount(async () => {
  console.log(
    "loadProfile2: ",
    (profile = await loadProfile(context.data.recipientAddress, $me))
  );
});

let classes: string;
let path: any;
let fromProfile: Profile;
let toProfile: Profile;
let targetProfile: Profile;
let message: string = "";
let now = new Date();
</script>

{#if _context.data && profile}
  <div
    class="flex flex-col items-center self-center w-full m-auto space-y-4 text-center justify-self-center">
    <div>
      <span class="inline-block text-6xl font-heading {classes}">
        {_context.data.tokens.amount}

        <svg
          class="inline w-10 h-10 -ml-2"
          viewBox="0 0 229 255"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M118.5 237C150.437 237 179.424 224.366 200.734 203.822C209.904
              197.627 215.933 187.136 215.933 175.236C215.933 156.198 200.499
              140.764 181.461 140.764C170.572 140.764 160.863 145.812 154.545
              153.695L154.457 153.627C145.313 163.112 132.476 169.012 118.261
              169.012C90.4957 169.012 67.9879 146.504 67.9879 118.739C67.9879
              90.9745 90.4957 68.4667 118.261 68.4667C132.339 68.4667 145.067
              74.254 154.193 83.5795L154.29 83.5037C160.581 90.2293 169.535
              94.4328 179.471 94.4328C198.51 94.4328 213.944 78.9988 213.944
              59.9601C213.944 48.1884 208.043 37.7949 199.039 31.5755C177.899
              11.9794 149.599 0 118.5 0C53.0543 0 0 53.0543 0 118.5C0 183.946
              53.0543 237 118.5 237Z"
            fill="currentColor"></path>
          <ellipse
            cx="118.979"
            cy="118.739"
            rx="26.5727"
            ry="26.3333"
            fill="currentColor"></ellipse>
        </svg>
      </span>
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

    <div class="flex flex-col w-full space-y-1">
      <div class="mb-1 text-left text-2xs text-dark-lightest">Amount</div>

      <div class="flex items-center w-full">
        <div class="text-left ">
          {#if _context.data.tokens.currency == "crc"}
            {convertTimeCirclesToCircles(
              _context.data.tokens ? _context.data.tokens.amount : "0",
              null
            )}
            Circles
          {:else}
            {_context.data.tokens ? _context.data.tokens.amount : "0"} xDai
          {/if}
        </div>
      </div>
    </div>

    <div class="flex flex-col w-full space-y-1">
      <div class="mb-1 text-left text-2xs text-dark-lightest">To</div>

      <div class="flex items-center w-full">
        <div class="text-left break-all">{profile.profile.circlesAddress}</div>
      </div>
    </div>

    <div class="flex flex-col w-full space-y-1">
      <div class="mb-1 text-left text-2xs text-dark-lightest">Block</div>

      <div class="flex items-center w-full">
        <div class="text-left break-all">
          {_context.data.receipt ? _context.data.receipt.blockNumber : ""}
        </div>
      </div>
    </div>

    <div class="flex flex-col w-full space-y-1">
      <div class="mb-1 text-left text-2xs text-dark-lightest">
        Transaction Hash
      </div>

      <div class="flex items-center w-full text-primarydark">
        <div class="text-left break-all">
          {_context.data.receipt ? _context.data.receipt.transactionHash : ""}
        </div>
      </div>
    </div>
  </div>
{/if}
