<script lang="ts">
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import {upsertIdentity} from "../processes/upsertIdentity";

  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import PassportHeader from "../atoms/PassportHeader.svelte";
  import {getCountryName} from "../../../shared/countries";
  import {me} from "../../../shared/stores/me";
  import {Profile} from "../data/api/types";
  import {invite} from "../processes/invite/invite";
  import {loadProfile} from "../processes/identify/services/loadProfile";
  import {mySafe} from "../../o-banking/stores/safe";

  let name;
  let profile: Profile;

  export let params: {
    profileId?: string
  }

  async function execLoadProfile(profileId?: string) {
    if (profileId && parseInt(profileId)) {
      profile = await loadProfile(parseInt(profileId));
      console.log("Other Profile: ", profile);
    } else if ($me) {
      profile = $me;
    }
  }

  $: {
    if ($me || (params && params.profileId)) {
      execLoadProfile(params ? params.profileId : $me.id.toString());
    }
  }

  const copy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: {name},
    });
    app.$destroy();
  };

  function editProfile() {
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = upsertIdentity;
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
          }
        };
        return ctx;
      }
    );

    window.o.publishEvent(requestEvent);
  }

  function execInvite() {
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = invite;
        ctx.childContext = {
          data: {
            safeAddress: $mySafe.safeAddress,
            inviteProfileId: parseInt(params.profileId)
          }
        };
        return ctx;
      }
    );

    window.o.publishEvent(requestEvent);
  }
</script>

<PassportHeader profile={profile}/>

<div class="mx-4 -mt-6">


  {#if profile && profile.circlesAddress}
  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
      <div
        class="text-circleslightblue text-xs font-circles font-bold text-left"
      >
        ADDRESS
      </div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <div class="text-left">
          <div class="inline-block break-all text-xs" id="clipboard">
            {#if profile}
              <input type="text" class="hidden" bind:value={profile.circlesAddress}/>
              {profile.circlesAddress ? profile.circlesAddress : ''}
            {/if}
            <div
              class="inline-block text-light cursor-pointertext-center text-xs relative -bottom-1"
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
  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
      <div
        class="text-circleslightblue text-xs font-circles font-bold text-left"
      >
        DREAM
      </div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <div class="text-left">
          <small class="break-all">
            {#if profile && profile.dream}
              {profile.dream}
            {:else}
              No Dream set.<br/>
              What is your life dream? Fill in the blanks. When I receive a universal
              basic income, I will follow my passion of _______________ and will
              accept Circles as payment.
              <button
                class="link link-primary text-primary text-2xs"
                on:click={editProfile}>Set Dream now
              </button
              >
            {/if}
          </small>
        </div>
      </div>
    </div>
  </section>

  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
      <div
        class="text-circleslightblue text-xs font-circles font-bold text-left"
      >
        COUNTRY
      </div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <div class="text-left">
          <small class="break-all">
            {#if profile && profile.country}
              {getCountryName(profile.country)}
            {:else}
              No Country set.
              <button
                class="link link-primary text-primary text-2xs"
                on:click={editProfile}>Set Country
              </button
              >
            {/if}
          </small>
        </div>
      </div>
    </div>
  </section>

  {#if profile && !profile.circlesAddress}
    <section class="justify-center mb-2 text-circlesdarkblue">
      <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
        <div
          class="text-circleslightblue text-xs font-circles font-bold text-left"
        >
          This citizen is waiting to be empowered by you.
        </div>
        {#if $me && $me.id !== profile.id && localStorage.getItem("safe")}
        <div class="flex items-center w-full space-x-2 sm:space-x-4">
          <div class="text-left">
            <div class="inline-block break-all text-xs">
              <div class="flex items-center w-full space-x-2 sm:space-x-4">
                <button class="btn btn-block btn-primary w-full" on:click={execInvite}>Invite {profile.firstName} now</button>
              </div>
            </div>
          </div>
        </div>
        {:else}
          <div className="flex items-center w-full space-x-2 sm:space-x-4">
            <div className="text-left">
              <div className="inline-block break-all text-xs">
                <div className="flex items-center w-full space-x-2 sm:space-x-4">
                  <!-- TODO: Safe wasn't opened before so we don't know our balance (at least not on $mySafe)  -->
                </div>
              </div>
            </div>
          </div>
        {/if}
      </div>
    </section>
  {/if}

</div>
