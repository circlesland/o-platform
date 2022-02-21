<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import Card from "src/shared/atoms/Card.svelte";
import { me } from "../../../shared/stores/me";
import { DelayedTrigger } from "@o-platform/o-utils/dist/delayedTrigger";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import Svelecte, { addFormatter } from "svelecte";
import {
  UpsertProfileDocument,
  DisplayCurrency,
  WhoamiDocument,
  WhoamiQueryVariables,
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";
import { _ } from "svelte-i18n";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let choices = [
  { value: DisplayCurrency.Crc, name: "CRC" },
  { value: DisplayCurrency.Eurs, name: "Euro" },
  { value: DisplayCurrency.TimeCrc, name: "Time Circles" },
];

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
      displayCurrency: displayCurrency,
      status: "",
    },
  });
  if (result.errors) {
    return;
  }
  console.log("RESULT ", result);
  window.o.publishEvent(<PlatformEvent>{
    type: "shell.authenticated",
    profile: result.data.upsertProfile,
  });
}

let email: string = "unknown";

onMount(async () => {
  email = await ApiClient.query<string, WhoamiQueryVariables>(
    WhoamiDocument,
    {}
  );
});

let receiveNewsletter: boolean = $me.newsletter;
let displayCurrency: string = $me.displayCurrency;
const delayedTrigger = new DelayedTrigger(500, async () => {
  // TODO: Make call to upsertProfile shorter
  await editProfile();
});
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mx-auto md:w-2/3 xl:w-1/2">
  <!-- <section class="flex items-center justify-center mx-4 mb-2 -mt-2">
    <Card>
      <div class="text-xs font-bold text-left text-primary">EMAIL</div>
      <div class="flex items-center w-full space-x-2 bg-white sm:space-x-6">
        <div class="mr-2 text-center">{email}</div>
      </div>
    </Card>
  </section> -->
  <section class="mx-4 mb-2 -mt-2">
    <Card>
      <div class="text-xs font-bold text-left text-primary">{$_("dapps.o-passport.pages.settings.notifications")}</div>
      <div class="w-full space-x-2 bg-white sm:space-x-6">
        <div class="w-full form-control">
          <label class="label" for="newsletter">
            <div
              class="flex flex-row items-stretch w-full space-x-10 cursor-pointer justify-items-stretch">
              <div
                class="self-center flex-grow text-sm text-right justify-self-start">
                {$_("dapps.o-passport.pages.settings.receiveEmailNotifications")}
              </div>
              <div class="self-center justify-self-end">
                <input
                  name="checkbox"
                  id="newsletter"
                  type="checkbox"
                  class="inline-block toggle toggle-primary"
                  bind:checked="{receiveNewsletter}"
                  on:change="{() => delayedTrigger.trigger()}" />

                <span class="toggle-mark"></span>
              </div>
            </div>
          </label>
        </div>
      </div>
    </Card>
  </section>
  <!-- <section class="mx-4 mb-2">
    <Card>
      <div class="text-xs font-bold text-left text-primary whitespace-nowrap">
        {$_("dapps.o-passport.pages.settings.currencyDisplay")}
      </div>
      <div class="w-full space-x-2 bg-white sm:space-x-6">
        <div class="w-full form-control">
          <label class="label" for="displayTimeCircles">
            <div class="flex flex-row items-stretch justify-end w-full">
              <select
                class="self-end w-full max-w-xs select select-bordered"
                bind:value="{displayCurrency}"
                on:change="{() => delayedTrigger.trigger()}">
                {#each choices as option, i}
                  <option value="{option.value}">{option.name}</option>
                {/each}
              </select>
            </div>
          </label>
        </div>
      </div>
    </Card>
  </section> -->
</div>
