<script lang="ts">
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { upsertIdentity } from "../processes/upsertIdentity";
  import { me } from "../../../shared/stores/me";
  import { Profile } from "../data/api/types";
  import { loadProfile } from "../processes/identify/services/loadProfile";
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import {AvataarGenerator} from "../../../shared/avataarGenerator";

  let profile: Profile;

  export let params: {
    profileId?: string;
  };

  async function execLoadProfile(profileId?: string) {
    if (profileId && parseInt(profileId)) {
      profile = await loadProfile(parseInt(profileId));
    }
  }


  let avatarUrl:string = "";
  $: {
    if (params && params.profileId) {
      execLoadProfile(params ? params.profileId : $me.id.toString());
    } else if ($me) {
      profile = $me;
    }

    if (profile && profile.avatarUrl) {
      avatarUrl = profile.avatarUrl
    }
    else if (profile)
    {
      avatarUrl = AvataarGenerator.generate(profile.circlesAddress)
    }
    else
    {
      avatarUrl = AvataarGenerator.default();
    }
  }

  function editProfileField(dirtyFlags: { [x: string]: boolean }) {
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
          },
          dirtyFlags: dirtyFlags,
        };
        return ctx;
      }
    );

    window.o.publishEvent(requestEvent);
  }
</script>

<TopNav />

<div
  class="h-60 flex flex-col w-full items-stretch justify-items-stretch  bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  <div class="self-center text-center block">
    <div class="avatar">
      <div class="w-36 h-36 rounded-full mb-4">
        <img
          src={avatarUrl}
          alt={profile
            ? profile.lastName
              ? `${profile.firstName} ${profile.lastName}`
              : profile.firstName
            : "avatar"}
        />
      </div>
      <button
        class="link link-primary text-primary text-2xs self-start relative top-1 right-2"
        on:click={() => editProfileField({ avatarUrl: true })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-3 w-3 relative top-0 right-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
          />
        </svg>
      </button>
    </div>
    <div class="">
      <h2>
        {profile ? profile.firstName : ""}
        {profile && profile.lastName ? profile.lastName : ""}
        <button
          class="link link-primary text-primary text-2xs self-start -mt-2 -mr-3"
          on:click={() => editProfileField({ firstName: true, lastName: true })}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3 relative top-0 right-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
          </svg>
        </button>
      </h2>
    </div>
  </div>
</div>
