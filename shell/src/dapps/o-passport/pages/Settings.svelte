<script lang="ts">
  import PassportHeader from "../atoms/PassportHeader.svelte";
  import {me} from "../../../shared/stores/me";
  import {DelayedTrigger} from "@o-platform/o-utils/dist/delayedTrigger";
  import {onMount} from "svelte";
  import {UpsertProfileDocument, WhoamiDocument} from "../data/api/types";

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
        newsletter: receiveNewsletter
      }
    });
    if (result.errors) {
      return;
    }
  }

  let email:string = "unknown";

  onMount(async () => {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: WhoamiDocument
    });
    if (result.errors) {
      return;
    }
    email = result.data.whoami;
  })

  let receiveNewsletter:boolean = $me.newsletter;
  const delayedTrigger = new DelayedTrigger(500, async () => {
    // TODO: Make call to upsertProfile shorter
    await editProfile();
  });

</script>

<PassportHeader />
<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  SETTINGS<br />
</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">email address<br/>{email}</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">
  <span class="inline">
    Newsletter
  </span>
  <input
        name="checkbox"
        id="newsletter"
        type="checkbox"
        bind:checked={receiveNewsletter}
        on:change={() => delayedTrigger.trigger()}
  />
</div>

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">tos</div>
