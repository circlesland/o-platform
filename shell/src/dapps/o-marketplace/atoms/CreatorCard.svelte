<script lang="ts">
  import { push } from "svelte-spa-router";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import {Profile} from "../data/api/types";

  export let profile: Profile;

  let displayName:string;
  let pictureUrl:string;
  let safeAddress:string;
  let id:number;

  $: {
    if (profile) {
      // <!-- TODO: Possible actions: trust (also: send money if they still trust $mySafe) -->
      displayName = profile
              ? profile.firstName + " " + profile.lastName
              : profile.circlesAddress;
      pictureUrl = profile ? profile.avatarUrl : undefined;
      safeAddress = profile.circlesAddress;
      id = profile.id;

      if (!pictureUrl) {
        pictureUrl = AvataarGenerator.generate(safeAddress);
      }
    }
  }

  function loadDetailPage() {
    push("#/banking/profile/" + profile.id);
  }
</script>

<section
  class="flex items-center justify-center mb-2 text-circlesdarkblue"
  on:click|once={() => loadDetailPage()}
>
  <div
    class="flex items-center w-full px-4 pt-5 space-x-2 bg-white rounded-sm shadow sm:space-x-6"
  >
    <div class="mr-2 -mt-3 text-center">
      <div class="avatar">
        <div class="w-12 h-12 m-auto rounded-full sm:w-12 sm:h-12">
          <img src={pictureUrl} alt={displayName} />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="max-w-full cursor-pointer truncateThis">
        <h2 class="text-2xl sm:text-3xl">
          {displayName}
        </h2>
      </div>

      <div class="mb-4 text-sm text-left text-red">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="inline w-4 h-4 -mt-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
        <span class="inline text-dark">{displayName}</span>
      </div>
    </div>

    <div class="flex flex-col self-start flex-1 justify-items-end">
      <div class="flex flex-col self-end space-y-2 text-2xl sm:text-3xl ">
        <button
          on:click={() => {}}
          class="self-end btn btn-square btn-md btn-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      </div>
      <!-- <div class="self-end mt-2 text-xs text-circleslightblue">
          9 days ago
        </div> -->
    </div>
  </div>
</section>
