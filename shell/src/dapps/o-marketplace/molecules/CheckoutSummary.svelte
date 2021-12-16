<script lang="ts">
import UserImage from "src/shared/atoms/UserImage.svelte";
import { cartContents, totalPrice } from "../stores/shoppingCartStore";
import CartItems from "../molecules/CartItems.svelte";
import CirclesTransferGraph from "../../../shared/pathfinder/CirclesTransferGraph.svelte";
import ProcessNavigation from "@o-platform/o-editors/src/ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { Profile, Organisation } from "../../../shared/api/data/types";
import { displayableName } from "../../../shared/functions/stringHelper";
import { Currency } from "../../../shared/currency";

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
      <span class="inline-block text-6xl font-enso {classes}">
        {$totalPrice.toFixed(2)}</span>
      <span class="text-6xl font-enso">€</span>
      <div>
        <span class="font-primary text-dark-lightest"
          >{$totalPrice * 10} {Currency.currencySymbol["TIME_CRC"]}</span>
      </div>
    </div>

    <UserImage profile="{profile}" size="{36}" gradientRing="{true}" />

    <div>
      <span class="mt-4 text-xl">
        to {displayableName(profile.firstName, profile.lastName)}
      </span>
      <div class="mt-2 text-dark-lightest">
        Reifenstuelstrasse. 6, 80469 München
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
      <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400">
          19% Sales Tax included:
        </span>
        <span class="w-20 text-lg text-right font-primary text-dark-lightest">
          {((19 / 100) * $totalPrice).toFixed(2)} €
        </span>
      </div>
      <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400"
          >Time Circles:</span>
        <span class="w-20 text-lg text-right font-primary text-dark-lightest"
          >{$totalPrice * 10} {Currency.currencySymbol["TIME_CRC"]}</span>
      </div>

      <!-- <div class="flex items-center justify-end w-full -mt-2">
        <span class="mr-2 text-sm font-medium text-gray-400">
          Total in Time:
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
