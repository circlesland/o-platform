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
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import PassportHeader from "../atoms/PassportHeader.svelte";
  import { getCountryName } from "../../../shared/countries";
  import { me } from "../../../shared/stores/me";
  import Router, { push, location } from "svelte-spa-router";

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
          messages: {},
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
          messages: {},
          environment: {},
        };
        return ctx;
      }
    );

    window.o.publishEvent(requestEvent);
  }
</script>

<PassportHeader />
{#if $me}
  {console.log("ME: ", $me)}
{/if}
<div class="mx-4 -mt-6">
  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div
        class="text-circleslightblue text-xs font-circles font-bold text-left"
      >
        ADDRESS
      </div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <div class="text-left">
          <small class="inline-block break-all" id="clipboard">
            <input type="text" class="hidden" bind:value={$me.circlesAddress} />
            {$me.circlesAddress}
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
          </small>
        </div>
      </div>
    </div>
  </section>

  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div
        class="text-circleslightblue text-xs font-circles font-bold text-left"
      >
        DREAM
      </div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <div class="text-left">
          <small class="break-all">
            {#if $me && $me.dream}
              {$me.dream}
            {:else}
              No Dream set.<br />
              What is your life dream? Fill in the blanks. When I receive a universal
              basic income, I will follow my passion of _______________ and will
              accept Circles as payment.
              <button
                class="link link-primary text-primary text-2xs"
                on:click={editProfile}>Set Dream now</button
              >
            {/if}
          </small>
        </div>
      </div>
    </div>
  </section>

  <section class="justify-center mb-2 text-circlesdarkblue">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2">
      <div
        class="text-circleslightblue text-xs font-circles font-bold text-left"
      >
        COUNTRY
      </div>

      <div class="flex items-center w-full space-x-2 sm:space-x-4">
        <div class="text-left">
          <small class="break-all">
            {#if $me && $me.country}
              {getCountryName($me.country)}
            {:else}
              No Country set.
              <button
                class="link link-primary text-primary text-2xs"
                on:click={editProfile}>Set Country</button
              >
            {/if}
          </small>
        </div>
      </div>
    </div>
  </section>
</div>
