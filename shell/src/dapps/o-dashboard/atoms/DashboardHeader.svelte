<script lang="ts">
  import { onMount } from "svelte";
  import { getLastLoadedDapp, getLastLoadedPage } from "../../../loader";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import gql from "graphql-tag";

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;

  let profile;

  async function loadMyProfile() {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query : gql`
      query profiles {
        profiles(query:{}) {
          firstName
          lastName
          dream
          country
          avatarCid
          avatarMimeType
        }
      }`,
      variables: {
      },
    });

    if (result.data && result.data.profiles && result.data.profiles.length > 0) {
      profile = result.data.profiles[0];
    }
  }

  onMount(() => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();
    loadMyProfile();
  });
</script>

<!-- DASHBOARD HEADER START -->
<div
  class="h-80 flex flex-col items-stretch navbar bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  {#if lastLoadedDapp && lastLoadedPage}
    <div class=" pl-2 ">
      <span class="text-lg font-circles"
        >{#if lastLoadedDapp.title != lastLoadedPage.title}
          {lastLoadedDapp.title} /
        {/if}{lastLoadedPage.title}</span
      >
    </div>
  {/if}
  <div class="self-center text-center mt-6 block">
    <div class="avatar">
      <div class="w-36 h-36 rounded-full ring ring-gradient1 mb-4">
        <img src="https://i.pravatar.cc/500?img=32" />
      </div>
    </div>
    <div class="">
      <strong>Hi {(profile ? profile.firstName : "Martin")},</strong> Welcome to CirclesLAND
    </div>
    <div class="">
      <small>This is your dashboard and door into our universe.</small>
    </div>
  </div>
</div>
<!-- DASHBOARD HEADER STOP -->
