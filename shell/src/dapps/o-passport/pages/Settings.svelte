<script lang="ts">
  import PassportHeader from "../atoms/PassportHeader.svelte";
  import { me } from "../../../shared/stores/me";
  import { DelayedTrigger } from "@o-platform/o-utils/dist/delayedTrigger";
  import { onMount } from "svelte";
  import { UpsertProfileDocument, WhoamiDocument } from "../data/api/types";

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

<PassportHeader />

<div class="mx-4 -mt-6">
  <section class="flex items-center justify-center mb-2 text-circlesdarkblue ">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
      <div class="text-primary text-xs font-circles font-bold text-left">
        EMAIL
      </div>
      <div class="flex items-center bg-white w-full space-x-2 sm:space-x-6">
        <div class="mr-2 text-center">
          {email}
        </div>
      </div>
    </div>
  </section>
  <section class="flex items-center justify-center mb-2 text-circlesdarkblue ">
    <div class="flex flex-col bg-white shadow p-4 w-full space-y-2 rounded-sm">
      <div class="text-primary text-xs font-circles font-bold text-left">
        NEWSLETTER
      </div>
      <div class="flex items-center bg-white w-full space-x-2 sm:space-x-6">
        <div class="form-control">
          <label
            class="label flex items-center flex-row cursor-pointer space-x-10"
            for="newsletter"
          >
            <span class="inline-block self-center">Receive Newsletter</span>
            <div class="inline-block self-center relative top-1">
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
          </label>
        </div>
      </div>
    </div>
  </section>
</div>
