<script lang="ts">
import UserImage from "src/shared/atoms/UserImage.svelte";
import { cartContents, totalPrice } from "../stores/shoppingCartStore";
import CartItems from "../molecules/CartItems.svelte";
import CirclesTransferGraph from "../../../shared/pathfinder/CirclesTransferGraph.svelte";
import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { Profile, Organisation } from "../../../shared/api/data/types";
import { displayableName } from "../../../shared/functions/stringHelper";

export let context: any;
let profile: Profile | Organisation;

$: {
  context = context;
  profile = context.data.sellerProfile;
}

let classes: string;

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

{#if context.data && profile}
  <div
    class="flex flex-col items-center self-center w-full m-auto space-y-4 text-center justify-self-center">
    <div>
      <span class="inline-block text-6xl font-heading {classes}">
        {$totalPrice.toFixed(2)}

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

    <UserImage profile="{profile}" size="{36}" gradientRing="{true}" />

    <div>
      <span class="mt-4 text-xl">
        to {displayableName(profile.firstName, profile.lastName)}
      </span>
      <div class="mt-2 text-dark-lightest">
        Reifenstühlstr. 6, 80469 München
        <br />
        <span class="text-sm"
          >Shop hours: Mo - Fr&nbsp;&nbsp;&nbsp;14:00 - 20:00</span>
      </div>
    </div>

    {#if context.data && context.data.transitivePath}
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          Payment Path
        </div>
        <div class="flex items-center w-full">
          <CirclesTransferGraph
            transfers="{context.data.transitivePath.transfers}"
            height="70px"
            onWhiteBackground="{true}" />
        </div>
      </div>
    {/if}

    <div class="flex flex-col w-full mt-6 space-y-1">
      <div class="flex flex-col items-center w-full">
        <CartItems cartContents="{cartContents}" editable="{false}" />
      </div>
      <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400"> Total: </span>
        <span class="w-20 text-lg font-bold text-right">
          {$totalPrice.toFixed(2)} €
        </span>
      </div>
      <!-- <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400">
          Total in Time Circles:
        </span>

        <span class="w-20 text-sm font-bold text-right">
          {($totalPrice * 10).toFixed(2)} ⦿
        </span>
      </div> -->
    </div>

    <div class="flex flex-col w-full space-y-2 text-left">
      <div class="pb-1 bg-gradient-to-r from-gradient1 to-gradient2">
        <h1 class="p-2 text-white uppercase bg-dark-dark ">
          Important Information
        </h1>
      </div>
      <div>
        After a successful purchase, we will show you a <span
          class="text-primary-dark">PickUp Code</span
        >, which you will need to
        <span class="text-primary-dark">show to the seller</span> when you pick up
        your Order at the Store.
      </div>
      <div class="pt-2 text-sm">
        To see your <span class="text-primary-dark">PickUp Code</span> at any
        time after the purchase, go to
        <span class="text-primary-dark">My purchases</span> and click on the Purchase.
      </div>
    </div>
  </div>
  <ProcessNavigation
    on:buttonClick="{submit}"
    context="{context}"
    noSticky="{true}" />
{/if}
