<script lang="ts">
  import { onMount } from "svelte";
  import {query} from "svelte-apollo";
  import {setClient} from "svelte-apollo";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { transfer } from "../processes/transfer";
  import { setTrust } from "../processes/setTrust";
  import BankingHeader from "../atoms/BankingHeader.svelte";
  import {sendInviteGas} from "../processes/sendInviteGas";
  import gql from "graphql-tag";

  export let params: {
    inviteAccountAddress?: string
  };

  onMount(() => {
    if (params && params.inviteAccountAddress) {
      execSendInviteGas(params.inviteAccountAddress);
    }
  });

  setClient(<any>window.o.theGraphClient);

  $:trusts = query(gql`
    query safe($id:String!) {
      safe(id: $id) {
        incoming {
          userAddress
          canSendToAddress
          limit
        }
        outgoing {
          userAddress
          canSendToAddress
          limit
        }
      }
    }`,
    {
      variables: {
        id: "0x9a0bbbbd3789f184ca88f2f6a40f42406cb842ac"
      }
    });


  function execTransfer(recipientAddress?: string) {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = transfer;
        ctx.childContext = {
          data: {
            recipientAddress,
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      })
    );
  }

  function execTrust(recipientAddress?: string) {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = setTrust;
        ctx.childContext = {
          data: {
            trustLimit: 100,
            trustReceiver: recipientAddress,
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      })
    );
  }

  function execUntrust(recipientAddress?: string) {
    window.o.publishEvent(
      new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
        ctx.childProcessDefinition = setTrust;
        ctx.childContext = {
          data: {
            trustLimit: 0,
            trustReceiver: recipientAddress,
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      })
    );
  }

  function execSendInviteGas(recipientAddress?: string) {
    window.o.publishEvent(new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = sendInviteGas;
        ctx.childContext = {
          data: {
            safeAddress: "TODO: my safe address",
            recipientAddress: recipientAddress,
            amount: 0.1
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      }));
  }
</script>

<BankingHeader />

<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
  {#if $trusts.loading}
    Loading offers...
  {:else if $trusts.error}
    <b>An error occurred while loading the recent activities:</b> <br/>{$trusts.error.message}
  {:else if $trusts.data && $trusts.data.safe && ($trusts.data.safe.incoming.length > 0  || $trusts.data.safe.outgoing.length > 0)}
    {#each $trusts.data.safe.incoming as incoming}
      <div>
        userAddress: {incoming.userAddress}<br/>
      </div>
    {/each}

    {#each $trusts.data.safe.outgoing as outgoing}
      <div>
        userAddress: {outgoing.userAddress}<br/>
      </div>
    {/each}
  {:else}
    <span>No recent activities</span>
  {/if}
</div>


<div class="mx-4 -mt-6">
  <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
    <div
      class="flex items-center bg-white shadow p-4 w-full space-x-2 sm:space-x-6"
    >
      <div class="mr-2 text-center">
        <div class="avatar">
          <div class="rounded-full w-12 h-12 sm:w-12 sm:h-12 m-auto">
            <img src="/images/common/circles.png" />
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
        <!-- <div class="self-end mt-2 text-xs text-circleslightblue">
          9 days ago
        </div> -->
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
            on:click={() => execUnTrust("this-guys-address")}
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
        <!-- <div class="self-end mt-2 text-xs text-circleslightblue">
          9 days ago
        </div> -->
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
        <!-- <div class="self-end mt-2 text-xs text-circleslightblue">
          9 days ago
        </div> -->
      </div>
    </div>
  </section>
</div>
