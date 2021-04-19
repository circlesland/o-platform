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

  import gql from "graphql-tag";

  export let params: {
    jwt: string;
  };

  let profile;

  onMount(() => {
    loadMyProfile();
  });

  $: {
    if (params && params.jwt) {
      // TODO: Verify the token and extract the e-mail address
      connectOrCreateKey(params.jwt);
      params.jwt = null;
    }
  }

  async function loadMyProfile() {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: gql`
        query profiles {
          profiles(query: {}) {
            firstName
            lastName
            dream
            country
            avatarCid
            avatarMimeType
          }
        }
      `,
      variables: {},
    });

    if (
      result.data &&
      result.data.profiles &&
      result.data.profiles.length > 0
    ) {
      profile = result.data.profiles[0];
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
  <h2 class="card-title">
    {profile ? profile.firstName : "Martin"}
    {profile ? profile.lastName : "Mustermann"}
  </h2>
  <small class="break-all">
    0x87asdgt9adsofz98ad6fs8as7odft9aszf98pasdzfasdg
  </small>
  <small class="break-all">
    {profile ? getCountryName(profile.country) : ""}
  </small>
  <small class="break-all">{profile ? profile.dream : "Dream"}</small>

  <button class="btn btn-primary w-1/2 mt-4 self-center">Edit Profile</button>
</div>
