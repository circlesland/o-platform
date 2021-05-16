<script lang="ts">
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { transfer } from "../processes/transfer";
  import { setTrust } from "../processes/setTrust";
  import TrustDetailHeader from "../atoms/TrustDetailHeader.svelte";
  import { TrustObject } from "../data/circles/types";
  import { mySafe } from "../stores/safe";

  export let params: {
    trustPartner: String;
  };

  let trust: TrustObject;
  let trusting: TrustObject;
  let trustedby: TrustObject;

  $: {
    if ($mySafe.trustRelations && params.trustPartner) {
      trusting = Object.values($mySafe.trustRelations.trusting).find(
        (o) => o.safeAddress == params.trustPartner
      );
      trustedby = Object.values($mySafe.trustRelations.trustedBy).find(
        (o) => o.safeAddress == params.trustPartner
      );

      trust = trusting ? trusting : trustedby;

      if (!trust) {
        trust = <TrustObject>{
          limit: 0,
          safeAddress: params.trustPartner,
          profile: {
            displayName: "",
            avatarUrl: "",
          },
          lastBlock: 0,
          hide: true,
          firstBlock: 0,
          type: "",
        };
      }
    }
  }

  function execTransfer() {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = transfer;
        ctx.childContext = {
          data: {
            safeAddress: $mySafe.safeAddress,
            recipientAddress: params.trustPartner,
          },
        };
        return ctx;
      })
    );
  }

  function execTrust() {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = setTrust;
        ctx.childContext = {
          data: {
            safeAddress: $mySafe.safeAddress,
            trustLimit: 100,
            trustReceiver: params.trustPartner,
            privateKey: localStorage.getItem("circlesKey"),
          },
        };
        return ctx;
      })
    );
  }

  function execUntrust() {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = setTrust;
        ctx.childContext = {
          data: {
            safeAddress: $mySafe.safeAddress,
            trustLimit: 0,
            trustReceiver: params.trustPartner,
            privateKey: localStorage.getItem("circlesKey"),
          },
        };
        return ctx;
      })
    );
  }
</script>

<TrustDetailHeader
  user={trust.profile ? trust.profile : { displayName: trust.safeAddress }}
  safeAddress={trust.safeAddress}
/>

<div class="mx-4 -mt-6">
  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div class="text-circleslightblue text-sm font-bold">TRUST</div>
      <div class="flex flex-col">
        {#if trusting && trustedby}
          <div class="text-left text-sm text-light mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 inline "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            <span class="inline text-dark"
              >You are trusting {trusting.profile
                ? trusting.profile.displayName
                : trusting.safeAddress}
              {trusting.limit}%
            </span>
          </div>

          <div class="text-left text-sm text-light mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 inline "
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
            <span class="inline text-dark"
              >{trustedby.profile
                ? trustedby.profile.displayName
                : trustedby.safeAddress} is trusting you {trustedby.limit}%
            </span>
          </div>
        {:else if trusting && !trustedby}
          <div class="text-left text-sm text-light mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 inline "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            <span class="inline text-dark"
              >You are trusting {trusting.profile
                ? trusting.profile.displayName
                : trusting.safeAddress}
              {trusting.limit}%
            </span>
          </div>
        {/if}
      </div>
    </div>
  </section>
  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div class="text-circleslightblue text-sm font-bold">INVITE</div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <button class="flex-1 btn btn-block btn-primary"
                on:click={() => execTransfer()}>Invite {trusting.profile
                ? trusting.profile.displayName
                : trusting.safeAddress}</button
        >
      </div>
    </div>
  </section>
  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div class="text-circleslightblue text-sm font-bold">CHANGE TRUST</div>
      {#if trusting && trusting.limit > 0}
        <div class="flex items-center w-full space-x-2 sm:space-x-4">
          <button
            class="btn btn-block btn-error"
            on:click={() => execUntrust()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-4 h-4 mr-2 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
            Remove trust
          </button>
        </div>
      {:else}
        <div class="flex items-center w-full space-x-2 sm:space-x-4">
          <button
            class="btn btn-block btn-primary"
            on:click={() => execTrust()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-4 h-4 mr-2 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            Trust
          </button>
        </div>
      {/if}
    </div>
  </section>
  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div class="text-circleslightblue text-sm font-bold">TRANSFER</div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <button
          class="btn btn-block btn-primary"
          on:click={() => execTransfer()}>Send Money</button
        >
      </div>
    </div>
  </section>
</div>
