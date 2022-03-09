<script lang="ts">
import "../../../shared/css/tailwind.css";

import { push } from "svelte-spa-router";
import { me } from "../../../shared/stores/me";
import { upsertIdentity } from "../../../dapps/o-passport/processes/upsertIdentity";

import Icons from "../../../shared/molecules/Icons.svelte";

function register() {
  window.runInitMachine();
}

function editProfileField(onlyThesePages: string[]) {
  window.o.runProcess(upsertIdentity, $me, {}, onlyThesePages);
}
</script>

<div
  class="h-screen px-4 text-white sm:px-8 event-background"
  style="background-image: url('/images/events/event-background-2500.jpg')">
  <div
    class="text-center pt-14 text-7xl sm:text-11xl event-heading-1 lg:text-12xl font-omedium whitespace-nowrap">
    TIME IS MONEY ...
  </div>
  <div
    class="w-full mt-2 text-6xl leading-tight text-right sm:text-9xl font-omedium whitespace-nowrap">
    NOW FOR REAL!
  </div>

  <div class="flex flex-col justify-between">
    <div
      class="invisible w-1/2 mt-12 text-xl leading-tight text-left break-words party-text sm:text-4xl lg:mt-40 md:text-4rem font-heading md:visible">
      Wir feiern <div class="visible sm:hidden"></div>
      <span class="whitespace-nowrap">dein erstes mal</span>
    </div>

    <div class="w-full text-center mt-36 sm:mt-60 md:mt-20 md:order-2">
      {#if $me}
        <button
          class="p-2 px-6 text-xl text-black bg-white sm:p-4 sm:px-10 sm:text-4xl font-heading"
          on:click="{() => editProfileField(['emailAddress'])}"
          >REGISTER NOW</button>
      {:else}
        <button
          class="p-2 px-6 text-xl text-black bg-white sm:p-4 sm:px-10 sm:text-4xl font-heading"
          on:click="{() => register()}">REGISTER NOW</button>
      {/if}
    </div>
  </div>
  <div class="absolute w-full pr-8 bottom-20 sm:bottom-4">
    <div
      class="grid w-full grid-cols-2 place-items-stretch justify-items-stretch place-content-end">
      <div class="self-end">
        <div
          class="visible w-1/2 mb-6 text-xl leading-tight text-left break-words party-text sm:text-4xl font-heading md:invisible">
          Wir feiern <div class="visible sm:hidden"></div>
          <span class="whitespace-nowrap">dein erstes mal</span>
        </div>
        <div class="text-2xl leading-tight text-left sm:text-4rem font-omedium">
          ALTE UTTING<br />19TH MARCH<br />START 2 PM
        </div>
      </div>
      <div
        class="pr-2 text-2xl leading-tight text-right break-words sm:pr-8 place-self-end sm:text-4rem font-omedium">
        <span class="whitespace-nowrap">Dein Krypto</span> grundeinkommen
        <span class="whitespace-nowrap">schon heute</span>
        <div class="visible sm:hidden"></div>
        <Icons
          icon="circlesinfinity"
          size="{10}"
          customClass="inline sm:w-20 sm:h-20" />
      </div>
    </div>
  </div>
</div>

<style>
.event-background {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: bottom center;
  z-index: 1;
  overflow: hidden;
  position: relative;
}

.party-text {
  line-height: 0.9;
}
</style>
