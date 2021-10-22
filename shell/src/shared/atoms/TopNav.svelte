<script lang="ts">
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import { me } from "../stores/me";
  import { push } from "svelte-spa-router";
  import Icons from "../molecules/Icons.svelte";
  import { Profile } from "../api/data/types";
  import UserImage from "./UserImage.svelte";
  import {switchProfile} from "../../dapps/o-passport/processes/switchProfile";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
  export let headerString: string = null;

  let profile: Profile;

  $: name = profile?.circlesAddress ? profile.circlesAddress : "";


  function showSwitcher() {
    window.o.runProcess(switchProfile, {});
  }

  $: {
    if ($me) {
      profile = $me;
    } else {
      profile = undefined;
    }
  }
</script>

<div class="fixed top-0 left-0 z-50 w-full">
  <div
    class="grid w-full grid-cols-3 p-2 mx-auto text-white navbar bg-dark-dark justify-items-stretch">
    <div class="justify-self-start whitespace-nowrap">
      <img src="/logos/circles.png" class="w-8 h-8" alt="Circles Land" />
      <span class="ml-2 text-2xl uppercase font-heading text-light">
        {runtimeDapp ? runtimeDapp.title : '<<No dapp>>'}
      </span>
    </div>

    <div class="justify-self-center">
      {#if headerString}
        <span class="text-md">{headerString}</span>
      {:else if (routable ? routable.title : '<<No dapp>>') != (runtimeDapp ? runtimeDapp.title : '<<No dapp>>')}
        <span class="text-md">{routable.title}</span>
      {/if}
    </div>

    <div class="col-start-3 pr-1 place-self-end justify-self-end">
      {#if profile}
        <div
          class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center" on:click={showSwitcher}>
          <UserImage {profile} size="{8}" profileLink="{false}" />

        </div>
      {/if}
    </div>
  </div>

</div>
