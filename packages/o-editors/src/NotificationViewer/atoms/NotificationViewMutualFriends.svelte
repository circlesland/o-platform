<script lang="ts">
import { CommonTrustDocument } from "src/shared/api/data/types";

import UserImage from "src/shared/atoms/UserImage.svelte";
export let profile;
export let eventData: any;

async function getMutualFriends() {
  if (eventData && eventData.profile) {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const mutualFriends = await apiClient.query({
      query: CommonTrustDocument,
      variables: {
        safeAddress1: eventData.safeAddress.toLowerCase(),
        safeAddress2: eventData.profile.circlesAddress.toLowerCase(),
      },
    });
    return mutualFriends;
  } else {
    throw new Error("no Data...");
  }
}

let promise = getMutualFriends();
</script>

{#await promise}
  <p>...loading mutual Friends</p>
{:then mutualFriends}
  {#if mutualFriends.data && mutualFriends.data.commonTrust}
    <div>
      <div class="text-left text-2xs text-dark-lightest">Mutual Friends</div>
      <div class="flex flex-row mt-2 space-x-2">
        {#if mutualFriends.data.commonTrust.length > 0}
          {#each mutualFriends.data.commonTrust as friend, i}
            {#if friend.profile}
              <UserImage
                profile="{friend.profile}"
                tooltip="{true}"
                gradientRing="{true}" />
            {/if}
          {/each}
        {:else}
          <span
            >No mutual Friends. Use the
            <button
              class="link link-primary text-primary"
              href="#/friends/graph"
              alt="CirclesLand Network Graph">Network Graph</button> to find common
            Friends.
          </span>
        {/if}
      </div>
    </div>
  {/if}
{:catch error}
  <!-- <p style="color: red">{error.message}</p> -->
{/await}
