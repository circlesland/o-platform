<script lang="ts">
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { upsertIdentity } from "../processes/upsertIdentity";

  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import PassportHeader from "../atoms/PassportHeader.svelte";
  import { getCountryName } from "../../../shared/countries";
  import { me } from "../../../shared/stores/me";
  import { Profile } from "../data/api/types";
  import { invite } from "../processes/invite/invite";
  import { loadProfile } from "../processes/identify/services/loadProfile";
  import { mySafe } from "../../o-banking/stores/safe";

  let name;
  let profile: Profile;

  $: name = profile ? profile.circlesAddress : "";

  $: {
    if ($me) {
      profile = $me;
    } else {
      profile = undefined;
    }
  }

  const copy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: { name },
    });
    app.$destroy();
  };

  function editProfile(dirtyFlags: { [x: string]: boolean }) {
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = {
          id: upsertIdentity.id,
          name: upsertIdentity.name,
          stateMachine: (processId?: string) =>
            (<any>upsertIdentity).stateMachine(processId, true),
        };
        ctx.childContext = {
          data: {
            id: profile.id,
            circlesAddress: profile.circlesAddress,
            circlesSafeOwner: profile.circlesSafeOwner,
            avatarCid: profile.avatarCid,
            avatarUrl: profile.avatarUrl,
            avatarMimeType: profile.avatarMimeType,
            firstName: profile.firstName,
            lastName: profile.lastName,
            country: profile.country,
            dream: profile.dream,
            cityGeonameid: profile.cityGeonameid,
          },
          dirtyFlags: dirtyFlags,
        };
        return ctx;
      }
    );

    window.o.publishEvent(requestEvent);
  }

</script>

<PassportHeader />

<div class="mx-4 -mt-6">
  {#if profile && profile.circlesAddress}
    <section class="justify-center mb-2 ">
      <div
        class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm"
      >
        <div class="text-circleslightblue text-xs  font-bold text-left">
          ADDRESS
        </div>

        <div class="flex items-center w-full space-x-2 sm:space-x-4">
          <div class="text-left">
            <div class="inline-block break-all text-xs" id="clipboard">
              {#if profile}
                <input
                  name="name"
                  type="text"
                  class="hidden"
                  bind:value={name}
                />
                {profile.circlesAddress ? profile.circlesAddress : ""}
              {/if}
              <div
                class="inline-block text-primary cursor-pointertext-center text-xs relative -bottom-1"
                on:click={copy}
                alt="Copy to Clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 stroke-current transform group-hover:rotate-[-4deg] transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  {/if}
  <section class="justify-center mb-2 ">
    <div
      class="card flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm"
    >
      <div class="text-circleslightblue text-xs  font-bold text-left">
        PASSION
      </div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <div class="text-left">
          <small>
            {#if profile && profile.dream}
              {profile.dream}
            {:else}
              No passion set.
            {/if}

            <button
              class="link link-primary text-primary text-2xs"
              on:click={() => editProfile({ dream: true })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
          </small>
        </div>
      </div>
    </div>
  </section>

  <section class="justify-center mb-2 ">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
      <div class="text-circleslightblue text-xs  font-bold text-left">CITY</div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <div class="text-left">
          <small>
            {#if profile && profile.city}
              {profile.city ? profile.city.name : ""}
            {:else}
              No city set.
            {/if}
            <button
              class="link link-primary text-primary text-2xs"
              on:click={() => editProfile({ cityGeonameid: true })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
          </small>
        </div>
      </div>
    </div>
  </section>

  <section class="justify-center mb-2 ">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
      <div class="text-circleslightblue text-xs  font-bold text-left">
        COUNTRY
      </div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <div class="text-left">
          <small>
            {#if profile}
              {profile.city ? profile.city.country : getCountryName(profile)}
            {:else}
              No Country set.
            {/if}
            <button
              class="link link-primary text-primary text-2xs"
              on:click={() => editProfile({ cityGeonameid: true })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </button>
          </small>
        </div>
      </div>
    </div>
  </section>
</div>
