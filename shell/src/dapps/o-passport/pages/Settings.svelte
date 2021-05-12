<script lang="ts">
  import PassportHeader from "../atoms/PassportHeader.svelte";
  import {me} from "../../../shared/stores/me";
  import {DelayedTrigger} from "@o-platform/o-utils/dist/delayedTrigger";
  import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
  import {shellProcess, ShellProcessContext} from "../../../shared/processes/shellProcess";
  import {upsertIdentity} from "../processes/upsertIdentity";

  function editProfile() {
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
  }

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

<div class="p-4 mt-4 bg-white rounded-t-xl md:rounded-xl">email address</div>

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
