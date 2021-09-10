<script lang="ts">
  import { setClient } from "svelte-apollo";
  import ChatListCard from "../atoms/ChatListCard.svelte";
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import { me } from "../../../shared/stores/me";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import Card from "src/shared/atoms/Card.svelte";
  import {onMount} from "svelte";
  import {TrustRelation, TrustRelationsDocument} from "../../o-banking/data/api/types";

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
      error = `Couldn't read the contacts of safe ${safeAddress}`;
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
      <!-- TODO: Possible actions: untrust, transfer money -->
      {#each mutual as mutualTrust}
        <ChatListCard
          trusting="{mutualTrust.trusting}"
          trustedBy="{mutualTrust.trustedBy}" />
      {/each}
    {/if}
    {#if trusting.length >= 1}
      {#each trusting as trusting}
        <!-- TODO: Possible actions: untrust -->
        <ChatListCard {trusting} />
      {/each}
    {/if}

    {#if trustedBy.length >= 1}
      <!-- TODO: Possible actions: trust, transfer money -->
      {#each trustedBy as trustedBy}
        <ChatListCard {trustedBy} />
      {/each}
    {/if}
<!--
    {#if Object.values($mySafe.trustRelations.untrusted).length >= 1}
      {#each Object.values($mySafe.trustRelations.untrusted) as untrusted}
        <ChatListCard {untrusted} />
      {/each}
    {/if}
-->
  {/if}

</div>
