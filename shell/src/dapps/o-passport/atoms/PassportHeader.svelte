<script lang="ts">
  import { onMount } from "svelte";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import { upsertIdentity } from "../processes/upsertIdentity";
  import { getLastLoadedDapp, getLastLoadedPage } from "../../../loader";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import { me } from "../../../shared/stores/me";

  $: me;
  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;

  onMount(() => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();
  });

  function editProfile() {
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = upsertIdentity;
        ctx.childContext = {
          data: {
            id: $me.id,
            firstName: $me.firstName,
            lastName: $me.lastName,
            country: $me.country,
            dream: $me.dream,
          },
          dirtyFlags: {},
          environment: {},
        };
        return ctx;
      }
    );

    window.o.publishEvent(requestEvent);
  }
</script>

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
      <div class="w-36 h-36 rounded-full mb-4">
        <img src="https://i.pravatar.cc/500?img=32" alt="username" />
      </div>
    </div>
    <div class="">
      <h2>{$me ? $me.firstName : "Martin"} {$me ? $me.lastName : "Meier"}</h2>
    </div>
    <button class="link link-primary text-primary" on:click={editProfile}
      >Edit Profile</button
    >
  </div>
</div>
