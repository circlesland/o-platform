<script lang="ts">
import { upsertIdentity } from "../processes/upsertIdentity";
import { me } from "../../../shared/stores/me";
import { loadProfile } from "../processes/identify/services/loadProfile";
import TopNav from "../../../shared/atoms/TopNav.svelte";
import PageHeader from "../../../shared/atoms/PageHeader.svelte";
import UserImage from "../../../shared/atoms/UserImage.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { getCountryName } from "../../../shared/countries";
import { Profile, Organisation } from "../../../shared/api/data/types";
import { upsertOrganisation } from "../../o-coop/processes/upsertOrganisation";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";

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

  displayName = profile.displayName;
}

function editProfileField(onlyThesePages: string[]) {
  if (profile.__typename == "Organisation") {
    window.o.runProcess(
      upsertOrganisation,
      {
        ...profile,
        successAction: (data) => {
          window.o.publishEvent(<PlatformEvent>{
            type: "shell.authenticated",
            profile: data,
          });
        },
      },
      {},
      onlyThesePages
    );
  } else {
    window.o.runProcess(upsertIdentity, profile, {}, onlyThesePages);
  }
}
</script>

<TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />

<PageHeader heightClass="h-60 sm:h-80" color="bg-passport" largeHeader="{true}">
  <div
    class="flex items-center px-10 h-52 sm:h-96 bg-passport-light"
    style="border-radius: 60% 96% 98% 91% / 115% 94% 104% 81%">
    <div class="pt-2 text-white">
      <span class="inline-block tracking-wide font-heading">
        <div class="self-center block mt-2 text-center">
          <div class="mb-2 sm:mb-4" on:click="{() => editProfileField(['file', 'avatarUrl'])}">
            <UserImage profile="{profile}" size="{36}" profileLink="{false}" />
          </div>

          <div
            on:click="{() =>
              profile.__typename === 'Organisation'
                ? editProfileField(['name'])
                : editProfileField(['firstName', 'lastName'])}">
            <h2 class="text-2xl cursor-pointer sm:text-4xl font-heading">
              {displayName}
            </h2>
          </div>
          {#if profile}
            {#if profile.city}
              <div
                class="mt-1 text-sm text-center cursor-pointer"
                on:click="{() => editProfileField(['cityGeonameid'])}">
                {profile.city ? profile.city.name : ""}
                {profile.city ? ", " + profile.city.country : ", " + getCountryName(profile)}
              </div>
            {:else}
              <div
                class="mt-1 text-sm text-center cursor-pointer"
                on:click="{() => editProfileField(['cityGeonameid'])}">
                Where do you live?
              </div>
            {/if}
          {/if}
        </div>
      </span>
    </div>
  </div>
</PageHeader>
