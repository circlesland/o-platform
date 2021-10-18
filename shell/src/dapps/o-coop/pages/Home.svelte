<script lang="ts">
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import {me} from "../../../shared/stores/me";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {Profile} from "../../../shared/api/data/types";
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import {upsertIdentity} from "../../o-passport/processes/upsertIdentity";

  let name;
  let profile: Profile;

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  $: name = profile?.circlesAddress ? profile.circlesAddress : "";

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
      props: {name},
    });
    app.$destroy();
  };

  function editProfile(dirtyFlags: { [x: string]: boolean }) {
    window.o.runProcess(upsertIdentity, profile, dirtyFlags, Object.keys(dirtyFlags));
  }
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
<div class="flex flex-col mx-auto md:w-2/3 xl:w-1/2">
  <div class="px-3 py-2 mx-4 -mt-2 bg-white rounded-lg shadow-sm">
    <section class="justify-center mb-2">
      <div class="flex flex-col w-full p-2 space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">Passion</div>

        <div class="flex items-center w-full space-x-2 sm:space-x-4">
          <div
            class="text-2xl leading-tight text-left font-heading"
            on:click="{() => editProfile({ dream: true })}">
            {#if profile && profile.dream}
              {profile.dream}
            {:else}No passion set.{/if}

          </div>
        </div>
      </div>
    </section>
    {#if profile && profile.circlesAddress}
      <section class="justify-center mb-2">
        <div class="flex flex-col w-full p-2 space-y-1">
          <div class="mb-1 text-left text-2xs text-dark-lightest">Address</div>

          <div class="flex items-center w-full space-x-2 sm:space-x-4">
            <div class="text-left">
              <div class="inline-block break-all" id="clipboard">
                {#if profile}
                  <input
                    name="name"
                    type="text"
                    class="hidden"
                    bind:value="{name}" />
                  {profile.circlesAddress ? profile.circlesAddress : ''}
                {/if}
                <div
                  class="relative inline-block text-xs text-primary cursor-pointertext-center -bottom-1"
                  on:click="{copy}"
                  alt="Copy to Clipboard">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 stroke-current transform
                    group-hover:rotate-[-4deg] transition"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2
                      0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0
                      012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    {/if}

  </div>
</div>
