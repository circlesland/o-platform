<script lang="ts">
  import { setClient } from "svelte-apollo";
  import TrustCard from "../atoms/TrustCard.svelte";
  import { mySafe } from "../stores/safe";
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import { me } from "../../../shared/stores/me";

  let inviteLink: string = "";

  $: {
    if ($me) {
      inviteLink = `${window.location.protocol}//${window.location.host}/#/banking/profile/${$me.id}`;
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

<SimpleHeader />

<div class="mx-4 -mt-6">
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
            <br />{$mySafe.ui.error.message}
          </div>
        </div>
      </div>
    </section>
  {:else}
    {#if Object.values($mySafe.trustRelations.mutualTrusts).length >= 1}
      <section class="flex items-center justify-center mb-1 ">
        <div
          class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
        >
          <div class="text-xs font-bold text-left  ">MUTUAL TRUST</div>
        </div>
      </section>
      <!-- TODO: Possible actions: untrust, transfer money -->
      {#each Object.values($mySafe.trustRelations.mutualTrusts) as mutualTrust}
        <TrustCard
          trusting={mutualTrust.trusting}
          trustedBy={mutualTrust.trustedBy}
        />
      {/each}
    {/if}
    {#if Object.values($mySafe.trustRelations.trusting).filter((o) => !o.hide).length >= 1}
      <section class="flex items-center justify-center mb-1 ">
        <div
          class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
        >
          <div class="text-xs font-bold text-left  ">TRUSTING</div>
        </div>
      </section>
      {#each Object.values($mySafe.trustRelations.trusting).filter((o) => !o.hide) as trusting}
        <!-- TODO: Possible actions: untrust -->
        <TrustCard {trusting} />
      {/each}
    {/if}

    {#if Object.values($mySafe.trustRelations.trustedBy).filter((o) => !o.hide && o.safeAddress !== $mySafe.safeAddress).length >= 1}
      <section class="flex items-center justify-center mb-1 ">
        <div
          class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
        >
          <div class="text-xs font-bold text-left text-primary ">
            TRUSTED BY
          </div>
        </div>
      </section>
      <!-- TODO: Possible actions: trust, transfer money -->
      {#each Object.values($mySafe.trustRelations.trustedBy).filter((o) => !o.hide && o.safeAddress !== $mySafe.safeAddress) as trustedBy}
        <TrustCard {trustedBy} />
      {/each}
    {/if}

    {#if Object.values($mySafe.trustRelations.untrusted).length >= 1}
      <section class="flex items-center justify-center mb-1 ">
        <div
          class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
        >
          <div class="text-xs font-bold text-left text-error ">
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
  <section class="justify-center mb-2 ">
    <div class="flex flex-col w-full p-4 space-y-2 shadow infocard">
      <div class="text-sm font-bold text-info">WHAT IS THIS?</div>
    </div>
    <div class="w-full shadow ">
      <img
        class="w-full"
        src="/images/common/explaintrust.png"
        alt="Trust Explained"
      />
    </div>
    <div class="flex flex-col w-full p-4 space-y-2 shadow infocard">
      <div class="text-sm">
        In CirclesLand everyone has their own personalized Circles money. You
        have "YOU" Circles and your friend Bob has "BOB" Circles.
        <br /><br />
        To be able to transfer Circles to someone you first need to get trusted by
        others. When you want to receive money you have to trust them back.
        <br /><br />
        To transact with a stranger the network will calculate the flow of money
        for you, based on your direct trust connections.
        <br /><br />
        The better you are connected the more useable your Circles become. Keep in
        mind to always only connect yourself with people you trust and know in person.
        To connect yourself, send your "trust link" to other citizens you know in
        person.
        <a
          href="https://blog.circles.land/whitepaper/"
          alt="CirclesLand Whitepaper"
          target="_blank"
          class="btn-link">Learn more</a
        >
      </div>
      <div class="mx-auto mt-6 btn btn-primary" id="clipboard" on:click={copy}>
        <input type="text" class="hidden" bind:value={inviteLink} />
        <span>Copy trust link</span>
      </div>
    </div>
  </section>
</div>
