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

  export let params: {
    jwt: string;
  };

  $: {
    if (params && params.jwt) {
      // TODO: Verify the token and extract the e-mail address
      connectOrCreateKey(params.jwt);
      params.jwt = null;
    }
  }

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

  function createOrUpdateIdentity() {
    const requestEvent = new RunProcess<ShellProcessContext>(
      shellProcess,
      true,
      async (ctx) => {
        ctx.childProcessDefinition = upsertIdentity;
        ctx.childContext = {
          data: {
            loginEmail: "TODO",
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

    requestEvent.id = Generate.randomHexString(8);
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
  <h2 class="card-title">Ernst Stavro Blofeld</h2>
  <small class="break-all">
    0x87asdgt9adsofz98ad6fs8as7odft9aszf98pasdzfasdg
  </small>
  <small class="break-all"> Country </small>
  <small class="break-all">Statement</small>
  <button class="btn btn-primary w-1/2 mt-4 self-center">Edit Profile</button>
</div>
