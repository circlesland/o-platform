<script lang="ts">
  import PassportHeader from "../atoms/PassportHeader.svelte";
  import { me } from "../../../shared/stores/me";
  import { DelayedTrigger } from "@o-platform/o-utils/dist/delayedTrigger";
  import { onMount } from "svelte";
  import { UpsertProfileDocument, WhoamiDocument } from "../data/api/types";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  export let runtimeDapp:RuntimeDapp<any>;
  export let routable:Routable;

  async function editProfile() {
    /*
    const requestEvent = new RunProcess<ShellProcessContext>(
            shellProcess,
            true,
            async (ctx) => {
              ctx.childProcessDefinition = {
                id: upsertIdentity.id,
                name: upsertIdentity.name,
                stateMachine: (processId?: string) =>
                        (<any>upsertIdentity).stateMachine(processId, true),
              };
              ctx.childContext = {
                data: {
                  id: $me.id,
                  circlesAddress: $me.circlesAddress,
                  circlesSafeOwner: $me.circlesSafeOwner,
                  avatarCid: $me.avatarCid,
                  avatarUrl: $me.avatarUrl,
                  avatarMimeType: $me.avatarMimeType,
                  firstName: $me.firstName,
                  lastName: $me.lastName,
                  country: $me.country,
                  dream: $me.dream,
                  newsletter: receiveNewsletter
                },
                dirtyFlags: {},
              };
              return ctx;
            }
    );

    window.o.publishEvent(requestEvent);
     */
    // TODO: Use process instead of direct api call. (would currently cause flicker in this scenario)
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.mutate({
      mutation: UpsertProfileDocument,
      variables: {
        id: $me.id,
        circlesAddress: $me.circlesAddress,
        circlesSafeOwner: $me.circlesSafeOwner,
        avatarCid: $me.avatarCid,
        avatarUrl: $me.avatarUrl,
        avatarMimeType: $me.avatarMimeType,
        firstName: $me.firstName,
        lastName: $me.lastName,
        country: $me.country,
        dream: $me.dream,
        newsletter: receiveNewsletter,
      },
    });
    if (result.errors) {
      return;
    }
    window.o.publishEvent(<PlatformEvent>{
      type: "shell.authenticated",
      profile: result.data.upsertProfile,
    });
  }

  let email: string = "unknown";

  onMount(async () => {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: WhoamiDocument,
    });
    if (result.errors) {
      return;
    }
    email = result.data.whoami;
  });

  let receiveNewsletter: boolean = $me.newsletter;
  const delayedTrigger = new DelayedTrigger(500, async () => {
    // TODO: Make call to upsertProfile shorter
    await editProfile();
  });

</script>

<PassportHeader {runtimeDapp} {routable}  />

<div class="mx-4 -mt-6">
  <section class="flex items-center justify-center mb-2  ">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
      <div class="text-primary text-xs  font-bold text-left">EMAIL</div>
      <div class="flex items-center bg-white w-full space-x-2 sm:space-x-6">
        <div class="mr-2 text-center">
          {email}
        </div>
      </div>
    </div>
  </section>
  <section class="flex items-center justify-center mb-2  ">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
      <div class="text-primary text-xs  font-bold text-left">NEWSLETTER</div>
      <div class="bg-white w-full space-x-2 sm:space-x-6">
        <div class="form-control w-full">
          <label class="label" for="newsletter">
            <div
              class="w-full flex items-stretch justify-items-stretch flex-row cursor-pointer space-x-10"
            >
              <div class="self-center flex-grow justify-self-start text-left">
                Receive Newsletter
              </div>
              <div class="self-center justify-self-end">
                <input
                  name="checkbox"
                  id="newsletter"
                  type="checkbox"
                  class="inline-block toggle toggle-primary"
                  bind:checked={receiveNewsletter}
                  on:change={() => delayedTrigger.trigger()}
                />

                <span class="toggle-mark" />
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </section>
</div>
