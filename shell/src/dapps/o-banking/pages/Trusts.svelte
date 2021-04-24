<script lang="ts">
  import { onMount } from "svelte";
  import { setClient } from "svelte-apollo";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import { sendInviteGas } from "../processes/sendInviteGas";
  import TrustCard from "../atoms/TrustCard.svelte";
  import { mySafe } from "../stores/safe";
  import { TrustObject } from "../data/circles/queries";

  let mutualTrusts: TrustObject[];
  let trusting: TrustObject[];
  let trusted: TrustObject[];

  export let params: {
    inviteAccountAddress?: string;
  };

  onMount(() => {
    if (params && params.inviteAccountAddress) {
      execSendInviteGas(params.inviteAccountAddress);
    }
  });

  setClient(<any>window.o.theGraphClient);

  function execSendInviteGas(recipientAddress?: string) {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = sendInviteGas;
        ctx.childContext = {
          data: {
            safeAddress: "TODO: my safe address",
            recipientAddress: recipientAddress,
            amount: 0.1,
          },
          messages:{},
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      })
    );
  }
</script>

<BankingHeader balance={$mySafe && $mySafe.balance ? $mySafe.balance : "0"} />
<div class="mx-4 -mt-6">
  {#if !$mySafe.trustRelations || !$mySafe.trustRelations.mutualTrusts || !$mySafe.trustRelations.trusting || !$mySafe.trustRelations.trustedBy}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>Loading Trusts...</div>
        </div>
      </div>
    </section>
  {:else if $mySafe.ui.error}
    <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
      <div class="flex items-center bg-white shadow p-4 w-full space-x-2 ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
            <br />{$mySafe.ui.error.message}
          </div>
        </div>
      </div>
    </section>
  {:else}
    <h1>Mutual trust</h1>
    {#each Object.values($mySafe.trustRelations.mutualTrusts) as mutualTrust(mutualTrust._id)}
      <TrustCard
        trusting={mutualTrust.trusting}
        trustedBy={mutualTrust.trustedBy}
        direction="mutual"
      />
    {/each}
    <h1>Trusting</h1>

    {#each Object.values($mySafe.trustRelations.trusting).filter((o) => !o.hide) as trusting(trusting.id)}
      <TrustCard {trusting} direction="trusting" />
    {/each}

    <h1>Trusted by</h1>
    {#each Object.values($mySafe.trustRelations.trustedBy).filter((o) => !o.hide) as trustedBy(trustedBy.id)}
      <TrustCard {trustedBy} direction="trusted" />
    {/each}
  {/if}
</div>
<!--
<div class="mx-4 -mt-6">
  <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src="/images/common/circles.png" alt="username" />
          </div>
        </div>
      </div>

      <div class="text-left">
        <div>
          <a href="#/banking/trusts/Samuel">
            <h2 class="text-2xl sm:text-3xl font-bold">Samuel</h2>
          </a>
        </div>
        <div class="text-left text-sm text-green mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 inline -mt-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          <span class="inline text-dark"> 100% mutual trust. </span>
        </div>
      </div>
      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-2xl sm:text-3xl">
          <button
            on:click={() => execTransfer("this-guys-address")}
            class="btn btn-square btn-sm btn-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
          <button
            on:click={() => execTrust("this-guys-address")}
            class="btn btn-square btn-sm btn-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>

  <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img
              src="http://t1.gstatic.com/licensed-image?q=tbn:ANd9GcQawphcbrPm24PJq9tv4BwQY3YQvK8ACK-7jGtVn52OjEfezo8Od_kleroqTbEv"
              alt="username"
            />
          </div>
        </div>
      </div>

      <div class="text-left">
        <div>
          <a href="#/banking/trusts/Klaus%20Meine">
            <h2 class="text-2xl sm:text-3xl font-bold">Klaus Meine</h2>
          </a>
        </div>
        <div class="text-left text-sm text-light mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 inline -mt-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
          <span class="inline text-dark"> 100% incoming trust. </span>
        </div>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-2xl sm:text-3xl">
          <button
            on:click={() => execTransfer("this-guys-address")}
            class="btn btn-square btn-sm btn-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
          <button
            on:click={() => execUntrust("this-guys-address")}
            class="btn btn-square btn-sm btn-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>

  <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img
              src="https://image.stern.de/8885220/t/q7/v3/w1440/r1/-/justin-bieber.jpg"
              alt="username"
            />
          </div>
        </div>
      </div>

      <div class="text-left">
        <div>
          <a href="#/banking/trusts/Bieberle">
            <h2 class="text-2xl sm:text-3xl font-bold">Justin Bieber</h2>
          </a>
        </div>
        <div class="text-left text-sm text-red mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 inline -mt-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
          <span class="inline text-dark"> removed trust. </span>
        </div>
      </div>

      <div class="flex flex-1 flex-col justify-items-end">
        <div class="self-end text-2xl sm:text-3xl">
          <button
            on:click={() => execTransfer("this-guys-address")}
            class="btn btn-square btn-sm btn-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </button>
          <button
            on:click={() => execTrust("this-guys-address")}
            class="btn btn-square btn-sm btn-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</div>
-->
