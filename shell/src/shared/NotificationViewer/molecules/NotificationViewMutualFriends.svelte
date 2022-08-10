<script lang="ts">
import {CommonTrust, CommonTrustDocument, CommonTrustQueryVariables, Profile} from "src/shared/api/data/types";
import UserImage from "src/shared/atoms/UserImage.svelte";
import {ApiClient} from "../../apiConnection";
import Label from "../../atoms/Label.svelte";

export const profile: Profile = undefined;
export const eventData: any = undefined;

async function getMutualFriends() : Promise<CommonTrust[]> {
  if (eventData && eventData.profile) {
    const mutualFriends = await ApiClient.query<CommonTrust[], CommonTrustQueryVariables>(CommonTrustDocument, {
      safeAddress1: eventData.safeAddress.toLowerCase(),
      safeAddress2: eventData.profile.circlesAddress.toLowerCase(),
    });
    return mutualFriends;
  } else {
    throw new Error(window.i18n("shared.molecules.notificationViewer.molecules.notificationViewMutualFriends.error"));
  }
}

let promise = getMutualFriends();
</script>

{#await promise}
  <p><Label key="shared.molecules.notificationViewer.molecules.notificationViewMutualFriends.loadingMutualFriends"  /></p>
{:then mutualFriends}
  {#if mutualFriends.data && mutualFriends.data.commonTrust}
    <div>
      <div class="text-left text-2xs text-dark-lightest"><Label key="shared.molecules.notificationViewer.molecules.notificationViewMutualFriends.mutualFriends"  /></div>

      <div class="flex flex-row flex-wrap mt-2 ">
        {#if mutualFriends.data.commonTrust.length > 0}
          {#each mutualFriends.data.commonTrust as friend, i}
            {#if friend.profile}
              <div class="mt-2 mr-2">
                <UserImage
                  profile="{friend.profile}"
                  tooltip="{true}"
                  gradientRing="{true}" />
              </div>
            {/if}
          {/each}
        {:else}
          <span><Label key="shared.molecules.notificationViewer.molecules.notificationViewMutualFriends.noMutualFriends"  /></span>
        {/if}
      </div>
    </div>
  {/if}
{:catch error}
  <!-- <p style="color: red">{error.message}</p> -->
{/await}
