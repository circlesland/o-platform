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

    <section class="flex items-center justify-center mb-1 ">
      <div
        class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm"
      >
        <div class="text-error text-xs font-circles font-bold text-left">
          UNTRUSTED
        </div>
      </div>
    </section>
    <!-- TODO: Possible actions: trust (also: send money if they still trust $mySafe) -->
    {#each Object.values($mySafe.trustRelations.untrusted) as untrusted}
      <TrustCard {untrusted} />
    {/each}
  {/if}
</div>
