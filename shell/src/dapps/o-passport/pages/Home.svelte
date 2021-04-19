<script lang="ts">
  import { createOrRestoreKey } from "../processes/createOrRestoreKey";
  import { RunProcess } from "@o-platform/o-process/dist/events/runProcess";
  import {
    shellProcess,
    ShellProcessContext,
  } from "../../../shared/processes/shellProcess";
  import Error from "../../../shared/atoms/Error.svelte";
  import LoadingIndicator from "../../../shared/atoms/LoadingIndicator.svelte";
  import Success from "../../../shared/atoms/Success.svelte";
  import { upsertIdentity } from "../processes/upsertIdentity";
  import { Generate } from "@o-platform/o-utils/dist/generate";
  import { onMount } from "svelte";
  import PassportHeader from "../atoms/PassportHeader.svelte";
  import { getCountryName } from "../../../shared/countries";
  import CopyClipBoard from "../../../shared/atoms/CopyClipBoard.svelte";
  import gql from "graphql-tag";
  import { me } from "../../../shared/stores/me";
  import Tooltip from "../../../shared/atoms/Tooltip.svelte";

  let show_elm = false;
  export let params: {
    jwt: string;
  };

  $: me;

  $: {
    if (params && params.jwt) {
      // TODO: Verify the token and extract the e-mail address
      connectOrCreateKey(params.jwt);
      params.jwt = null;
    }
  }

  let name = "0x87asdgt9adsofz98ad6fs8as7odft9aszf98pasdzfasdg";

  const copy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: { name },
    });
    app.$destroy();
  };

  function connectOrCreateKey(jwt?: string) {
    const sub = jwt; //.sub; //TODO: Get email from jwt
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = createOrRestoreKey;
        ctx.childContext = {
          data: {
            loginEmail: sub,
          },
          dirtyFlags: {},
          environment: {
            errorView: Error,
            progressView: LoadingIndicator,
            successView: Success,
          },
        };
        return ctx;
      }
    );

    window.o.publishEvent(requestEvent);
  }

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

<PassportHeader />

<div class="flex flex-col self-center text-center -mt-12 ">
  <div class="avatar self-center">
    <div class="w-24 h-24 rounded-full  mb-4">
      <img
        src="https://upload.wikimedia.org/wikipedia/en/c/c3/Blofeldpleasance67.jpg"
      />
    </div>
  </div>
  <h2 class="card-title">
    {console.log("ME: ", $me)}
    {$me ? $me.firstName : "Martin"}
    {$me ? $me.lastName : "Mustermann"}
  </h2>
  <div class="break-all">
    <small class="inline-block" id="clipboard">
      <input type="text" class="hidden" bind:value={name} />
      0x87asdgt9adsofz98ad6fs8as7odft9aszf98pasdzfasdg
    </small>
    <div
      class="inline-block text-light cursor-pointer has-tooltip text-center text-xs relative -bottom-1"
      on:mouseenter={() => (show_elm = true)}
      on:mouseleave={() => (show_elm = false)}
      on:click={copy}
      alt="Copy to Clipboard"
    >
      <Tooltip
        pointer="end"
        position="top"
        text="Copy to Clipboard!"
        w="28"
        color="white"
        show={show_elm}
      >
        <div class="text-xs px-1 bg-white text-primary">
          <small>Copy to Clipboard!</small>
        </div>
      </Tooltip>

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
  <small class="break-all">
    {$me ? getCountryName($me.country) : ""}
  </small>
  <small class="break-all">{$me ? $me.dream : "Dream"}</small>

  <button class="btn btn-primary w-1/2 mt-4 self-center" on:click={editProfile}
    >Edit Profile</button
  >
</div>
