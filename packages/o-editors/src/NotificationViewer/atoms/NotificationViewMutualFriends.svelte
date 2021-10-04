<script lang="ts">
import { CommonTrustDocument } from "src/shared/api/data/types";
import { AvataarGenerator } from "src/shared/avataarGenerator";

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
      <div class="flex flex-row space-x-2">
        {#if mutualFriends.data.commonTrust.length > 0}
          {#each mutualFriends.data.commonTrust as friend, i}
            {#if friend.profile}
              <div class="has-tooltip">
                <span
                  class="px-2 mt-12 text-sm bg-white rounded shadow-sm tooltip"
                  >{friend.profile
                    ? friend.profile.lastName
                      ? `${friend.profile.firstName} ${friend.profile.lastName}`
                      : friend.profile.firstName
                    : "avatar"}</span>

                <div
                  class="self-center mt-4 text-center avatar justify-self-center rounded-corners-gradient-borders"
                  style="padding: 1px">
                  <div class="w-10 h-10 m-auto bg-white rounded-full">
                    <img
                      src="{friend.profile && friend.profile.avatarUrl
                        ? friend.profile.avatarUrl
                        : AvataarGenerator.generate(
                            friend.profile.circlesAddress
                          )}"
                      alt="{friend.profile
                        ? friend.profile.lastName
                          ? `${friend.profile.firstName} ${friend.profile.lastName}`
                          : friend.profile.firstName
                        : 'avatar'}" />
                  </div>
                </div>
              </div>
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
