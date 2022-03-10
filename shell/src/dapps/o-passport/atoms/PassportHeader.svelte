<script lang="ts">
import { upsertIdentity } from "../processes/upsertIdentity";
import { me } from "../../../shared/stores/me";
import { loadProfile } from "../processes/identify/services/loadProfile";
import TopNav from "src/shared/atoms/TopNav.svelte";
import PageHeader from "src/shared/atoms/PageHeader.svelte";
import UserImage from "src/shared/atoms/UserImage.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { getCountryName } from "../../../shared/countries";
import { Profile, Organisation } from "../../../shared/api/data/types";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
let profile: Profile | Organisation;
let displayName: string;

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

  if (profile.__typename == "Profile") {
    displayName = profile.displayName;
  } else {
    displayName = profile.name ? " " + profile.name : "";
  }
}

function editProfileField(onlyThesePages: string[]) {
  window.o.runProcess(upsertIdentity, profile, {}, onlyThesePages);
}
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />

<PageHeader heightClass="h-72">
  <div class="self-center block mt-2 text-center">
    <div
      class="mb-4"
      on:click="{() => editProfileField(['file', 'avatarUrl'])}">
      <UserImage profile="{profile}" size="{36}" profileLink="{false}" />
    </div>

    <div on:click="{() => editProfileField(['firstName', 'lastName'])}">
      <h2 class="text-4xl cursor-pointer font-heading">
        {displayName}
      </h2>
    </div>
  </div>
  {#if profile && profile.city}
    <div
      class="mt-1 text-sm text-center cursor-pointer"
      on:click="{() => editProfileField(['cityGeonameid'])}">
      {profile.city ? profile.city.name : ""}
      {profile.city
        ? ", " + profile.city.country
        : ", " + getCountryName(profile)}
    </div>
  {/if}
</PageHeader>
