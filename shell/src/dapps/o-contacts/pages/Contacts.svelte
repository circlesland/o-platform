<script lang="ts">
  import { setClient } from "svelte-apollo";
  import ContactCard from "../atoms/ContactCard.svelte";
  import { mySafe } from "../../o-banking/stores/safe";
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import { me } from "../../../shared/stores/me";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import Card from "src/shared/atoms/Card.svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let inviteLink: string = "";

  $: {
    if ($me) {
      inviteLink = `${window.location.protocol}//${window.location.host}/#/friends/profile/${$me.id}`;
    }
  }

  setClient(<any>window.o.theGraphClient);

  const copy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: { name: inviteLink },
    });
    app.$destroy();
  };
</script>

<SimpleHeader {runtimeDapp} {routable} />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">
  {#if !$mySafe.trustRelations || !$mySafe.trustRelations.mutualTrusts || !$mySafe.trustRelations.trusting || !$mySafe.trustRelations.trustedBy}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading Trusts...</div>
        </div>
      </div>
    </section>
  {:else if $mySafe.ui.error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
            <br />
            {$mySafe.ui.error.message}
          </div>
        </div>
      </div>
    </section>
  {:else}
    {#if Object.values($mySafe.trustRelations.mutualTrusts).length >= 1}
      <!-- TODO: Possible actions: untrust, transfer money -->
      {#each Object.values($mySafe.trustRelations.mutualTrusts) as mutualTrust}
        <ContactCard
          trusting="{mutualTrust.trusting}"
          trustedBy="{mutualTrust.trustedBy}" />
      {/each}
    {/if}
    {#if Object.values($mySafe.trustRelations.trusting).filter(o => !o.hide).length >= 1}
      {#each Object.values($mySafe.trustRelations.trusting).filter(o => !o.hide) as trusting}
        <!-- TODO: Possible actions: untrust -->
        <ContactCard {trusting} />
      {/each}
    {/if}

    {#if Object.values($mySafe.trustRelations.trustedBy).filter(o => !o.hide && o.safeAddress !== $mySafe.safeAddress).length >= 1}
      <!-- TODO: Possible actions: trust, transfer money -->
      {#each Object.values($mySafe.trustRelations.trustedBy).filter(o => !o.hide && o.safeAddress !== $mySafe.safeAddress) as trustedBy}
        <ContactCard {trustedBy} />
      {/each}
    {/if}

    {#if Object.values($mySafe.trustRelations.untrusted).length >= 1}
      <!-- TODO: Possible actions: trust (also: send money if they still trust $mySafe) -->
      {#each Object.values($mySafe.trustRelations.untrusted) as untrusted}
        <ContactCard {untrusted} />
      {/each}
    {/if}
  {/if}

</div>
