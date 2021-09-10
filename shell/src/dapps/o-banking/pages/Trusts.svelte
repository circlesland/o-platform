<script lang="ts">
  import { setClient } from "svelte-apollo";
  import TrustCard from "../atoms/TrustCard.svelte";
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import { me } from "../../../shared/stores/me";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import Card from "src/shared/atoms/Card.svelte";
  import {TrustRelation, TrustRelationsDocument} from "../data/api/types";
  import {onMount} from "svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let inviteLink: string = "";
  let trustRelations:TrustRelation[] = null;
  let error:string|undefined = undefined;

  let mutual: TrustRelation[] = [];
  let trusting: TrustRelation[] = [];
  let trustedBy: TrustRelation[] = [];

  onMount(async () => {
    const safeAddress = $me.circlesAddress;
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const trustResult = await apiClient.query({
      query: TrustRelationsDocument,
      variables: {
        safeAddress
      }
    });
    if (trustResult.errors?.length > 0) {
      error = `Couldn't read the trusts of safe ${safeAddress}`;
      return;
    }
    trustRelations = trustResult.data.trustRelations;
    mutual = trustRelations.filter(o => o.direction === "MUTUAL");
    trusting = trustRelations.filter(o => o.direction === "OUT");
    trustedBy = trustRelations.filter(o => o.direction === "IN");
  });

  $: {
    if ($me) {
      inviteLink = `${window.location.protocol}//${window.location.host}/#/friends/${$me.id}`;
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
  {#if !trustRelations && !error}
  <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading Trusts...</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
            <br />
            {error}
          </div>
        </div>
      </div>
    </section>
  {:else}
    {#if mutual.length >= 1}
      <section class="flex items-center justify-center mb-1 ">
        <Card>
          <div class="text-xs font-bold text-left ">MUTUAL TRUST</div>
        </Card>
      </section>
      <!-- TODO: Possible actions: untrust, transfer money -->
      {#each mutual as mutualTrust}
        <TrustCard
          trusting="{mutualTrust.trusting}"
          trustedBy="{mutualTrust.trustedBy}" />
      {/each}
    {/if}
    {#if trusting.length >= 1}
      <section class="flex items-center justify-center mb-1 ">
        <Card>
          <div class="text-xs font-bold text-left ">TRUSTING</div>
        </Card>
      </section>
      {#each trusting as trusting}
        <!-- TODO: Possible actions: untrust -->
        <TrustCard {trusting} />
      {/each}
    {/if}

    {#if trustedBy.length >= 1}
      <section class="flex items-center justify-center mb-1 ">
        <Card>
          <div class="text-xs font-bold text-left text-primary ">
            TRUSTED BY
          </div>
        </Card>
      </section>
      <!-- TODO: Possible actions: trust, transfer money -->
      {#each trustedBy as trustedBy}
        <TrustCard {trustedBy} />
      {/each}
    {/if}
<!--
    {#if Object.values($mySafe.trustRelations.untrusted).length >= 1}
      <section class="flex items-center justify-center mb-1 ">
        <Card>
          <div class="text-xs font-bold text-left text-error ">
            TRUST REMOVED
          </div>
        </Card>
      </section>
      {#each Object.values($mySafe.trustRelations.untrusted) as untrusted}
        <TrustCard {untrusted} />
      {/each}
    {/if}
    -->
  {/if}
  <section class="justify-center mb-2 ">
    <div class="flex flex-col w-full p-4 space-y-2 shadow infocard">
      <div class="text-sm font-bold text-info">WHAT IS THIS?</div>
    </div>
    <div class="w-full shadow ">
      <img
        class="w-full"
        src="/images/common/explaintrust.png"
        alt="Trust Explained" />
    </div>
    <div class="flex flex-col w-full p-4 space-y-2 shadow infocard">
      <div class="text-sm">
        In CirclesLand everyone has their own personalized Circles money. You
        have "YOU" Circles and your friend Bob has "BOB" Circles.
        <br />
        <br />
        To be able to transfer Circles to someone you first need to get trusted
        by others. When you want to receive money you have to trust them back.
        <br />
        <br />
        To transact with a stranger the network will calculate the flow of money
        for you, based on your direct trust connections.
        <br />
        <br />
        The better you are connected the more useable your Circles become. Keep
        in mind to always only connect yourself with people you trust and know
        in person. To connect yourself, send your "trust link" to other citizens
        you know in person.
        <a
          href="https://blog.circles.land/whitepaper/"
          alt="CirclesLand Whitepaper"
          target="_blank"
          class="btn-link">
          Learn more
        </a>
      </div>
      <div
        class="mx-auto mt-6 btn btn-primary"
        id="clipboard"
        on:click="{copy}">
        <input type="text" class="hidden" bind:value="{inviteLink}" />
        <span>Copy trust link</span>
      </div>
    </div>
  </section>
</div>
