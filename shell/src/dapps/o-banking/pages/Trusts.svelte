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
  import TrustDetailHeader from "../atoms/TrustDetailHeader.svelte";
  import TokensHeader from "../atoms/TokensHeader.svelte";

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
        };
        return ctx;
      })
    );
  }
</script>

<TokensHeader />
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
    <section class="flex items-center justify-center mb-1 ">
      <div
        class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm"
      >
        <div class="text-secondary text-xs font-circles font-bold text-left">
          MUTUAL TRUST
        </div>
      </div>
    </section>
    <!-- TODO: Possible actions: untrust, transfer money -->
    {#each Object.values($mySafe.trustRelations.mutualTrusts) as mutualTrust}
      <TrustCard
        trusting={mutualTrust.trusting}
        trustedBy={mutualTrust.trustedBy}
      />
    {/each}

    <section class="flex items-center justify-center mb-1 ">
      <div
        class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm"
      >
        <div class="text-secondary text-xs font-circles font-bold text-left">
          TRUSTING
        </div>
      </div>
    </section>
    {#each Object.values($mySafe.trustRelations.trusting).filter((o) => !o.hide) as trusting}
      <!-- TODO: Possible actions: untrust -->
      <TrustCard {trusting} />
    {/each}

    <section class="flex items-center justify-center mb-1 ">
      <div
        class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm"
      >
        <div class="text-primary text-xs font-circles font-bold text-left">
          TRUSTED BY
        </div>
      </div>
    </section>
    <!-- TODO: Possible actions: trust, transfer money -->
    {#each Object.values($mySafe.trustRelations.trustedBy).filter((o) => !o.hide && o.safeAddress.toLowerCase() !== $mySafe.safeAddress.toLowerCase()) as trustedBy}
      <TrustCard {trustedBy} />
    {/each}

    {#if $mySafe.trustRelations.untrusted}
      <section class="flex items-center justify-center mb-1 ">
        <div
          class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm"
        >
          <div class="text-error text-xs font-circles font-bold text-left">
            TRUST REMOVED
          </div>
        </div>
      </section>
      <!-- TODO: Possible actions: trust (also: send money if they still trust $mySafe) -->
      {#each Object.values($mySafe.trustRelations.untrusted) as untrusted}
        <TrustCard {untrusted} />
      {/each}
    {/if}
  {/if}
  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div class="text-circleslightblue text-sm font-bold">WHAT IS TRUST?</div>
    </div>
    <div class="w-full shadow ">
      <img
        class="w-full"
        src="/images/common/explaintrust.png"
        alt="Trust Explained"
      />
    </div>
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div class="text-sm">
        In CirclesLand everyone has their own personalized Circles money.
        <br /><br />
        To be able to transfer Circles to someone you first need to get trusted by
        others. When you want to receive money you have to trust them back.
        <br /><br />
        Keep in mind to always only connect yourself with people you trust and know
        in person. <br /><br />To transact with a stranger the network will
        calculate the flow of money for you, based on your direct trust
        connections.
        <a
          href="https://blog.circles.land/whitepaper/"
          alt="CirclesLand Whitepaper"
          class="btn-link">Learn more</a
        >
      </div>
      <button class="btn btn-primary mt-6 mx-auto">copy my trust link</button>
    </div>
  </section>
</div>
