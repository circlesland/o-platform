<script lang="ts">
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import {
    upsertIdentity,
    upsertIdentityOnlyWhereDirty,
  } from "../processes/upsertIdentity";
  import { me } from "../../../shared/stores/me";
  import { loadProfile } from "../processes/identify/services/loadProfile";
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import PageHeader from "src/shared/atoms/PageHeader.svelte";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import { getCountryName } from "../../../shared/countries";
  import {Profile} from "../../../shared/api/data/types";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
  let profile: Profile;

  export let params: {
    profileId?: string;
  };

  async function execLoadProfile(profileId?: string) {
    if (profileId && parseInt(profileId)) {
      profile = await loadProfile(parseInt(profileId));
    }
  }

  let avatarUrl: string = "";
  $: {
    if (params && params.profileId) {
      execLoadProfile(params ? params.profileId : $me.id.toString());
    } else if ($me) {
      profile = $me;
    }

    if (profile && profile.avatarUrl) {
      avatarUrl = profile.avatarUrl;
    } else if (profile) {
      avatarUrl = AvataarGenerator.generate(profile.circlesAddress);
    } else {
      avatarUrl = AvataarGenerator.default();
    }
  }

  function editProfileField(dirtyFlags: { [x: string]: boolean }) {
    window.o.runProcess(upsertIdentityOnlyWhereDirty, profile, dirtyFlags);
  }
</script>

<TopNav {runtimeDapp} {routable} />

<PageHeader heightClass="h-72">
  <div class="self-center block mt-2 text-center">
    <div class="inline-flex">
      <div
        class="mb-4 rounded-full cursor-pointer ring ring-white w-36 h-36"
        on:click="{() => editProfileField({ avatarUrl: true })}">
        <img
          class="rounded-full"
          src="{avatarUrl}"
          alt="{profile ? (profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.firstName) : 'avatar'}" />
      </div>

    </div>
    <div
      on:click="{() => editProfileField({ firstName: true, lastName: true })}">
      <h2 class="text-4xl cursor-pointer font-heading">
        {profile ? profile.firstName : ''}
        {profile && profile.lastName ? profile.lastName : ''}
      </h2>
    </div>
  </div>
  {#if profile && profile.city}
    <div
      class="mt-1 text-sm text-center cursor-pointer"
      on:click="{() => editProfileField({ cityGeonameid: true })}">
      {profile.city ? profile.city.name : ''}
      {profile.city ? ', ' + profile.city.country : ', ' + getCountryName(profile)}
    </div>
  {/if}
</PageHeader>
