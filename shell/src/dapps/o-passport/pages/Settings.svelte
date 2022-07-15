<script lang="ts">
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";

import { me } from "../../../shared/stores/me";
import { DelayedTrigger } from "@o-platform/o-utils/dist/delayedTrigger";
import { onMount } from "svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { showToast } from "../../../shared/toast";
import Svelecte, { addFormatter } from "svelecte";
import {
  UpsertProfileDocument,
  DisplayCurrency,
  WhoamiDocument,
  WhoamiQueryVariables,
} from "../../../shared/api/data/types";
import { upsertIdentity } from "../processes/upsertIdentity";
import { ApiClient } from "../../../shared/apiConnection";
import Label from "../../../shared/atoms/Label.svelte";
import { _ } from "svelte-i18n";


export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let choices = [
  { value: DisplayCurrency.Crc, name: "CRC" },
  { value: DisplayCurrency.Eurs, name: "Euro" },
  { value: DisplayCurrency.TimeCrc, name: "Time Circles" },
];

const delayedTrigger = new DelayedTrigger(200, async () => {
  console.log("delayedTrigger");
  // TODO: Use process instead of direct api call. (would currently cause flicker in this scenario)
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const result = await apiClient.mutate({
    mutation: UpsertProfileDocument,
    variables: {
      ...$me,
      status: "",
    },
  });

  if (result.errors) {
    return;
  }

  window.o.publishEvent(<PlatformEvent>{
    type: "shell.authenticated",
    profile: result.data.upsertProfile,
  });

  showToast(
    "success",
    `${$_("dapps.o-passport.pages.settings.settingsSaved")}`
  );
});

function editProfileField(onlyThesePages: string[], dirtyFlags: any = {}) {
  console.log("editProfileField");
  window.o.runProcess(upsertIdentity, $me, dirtyFlags, onlyThesePages);
}
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
    <div
      class="flex flex-col w-full px-3 py-2 space-x-2 bg-white rounded-lg shadow-md ">
      <div class="flex flex-col space-y-2">
        <div class="text-left">
          <Label key="dapps.o-passport.pages.settings.notifications"  />
        </div>
        <div class="space-x-2 sm:space-x-6">
          <div class="w-full form-control">
            <label class="pl-0 label" for="newsletter">
              <div
                class="flex flex-row items-stretch w-full space-x-2 cursor-pointer justify-items-stretch">
                <div class="self-center justify-self-center">
                  <Label key="common.no"  />
                </div>
                <div class="self-center justify-self-center">
                  <input
                    name="checkbox"
                    id="newsletter"
                    type="checkbox"
                    class="inline-block toggle toggle-primary"
                    bind:checked="{$me.newsletter}"
                    on:change="{(e) => {
                      delayedTrigger.trigger();
                      e.preventDefault();
                      return false;
                    }}" />

                  <span class="toggle-mark"></span>
                </div>
                <div class="self-center justify-self-center">
                  <Label key="common.yes"  />
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="mx-4 mt-4 mb-2">
    <div
      class="flex flex-col w-full px-3 py-2 space-x-2 bg-white rounded-lg shadow-md ">
      <div class="flex flex-col space-y-2">
        <div class="text-left">
          <Label key="dapps.o-passport.pages.settings.emailAddress"  />
        </div>
        <div class="">
          <div class="w-full form-control">
            <label class="pl-0 label" for="emailAddress">
              <div
                class="w-full text-left cursor-pointer"
                on:click="{() =>
                  editProfileField(['emailAddress'], { emailAddress: true })}">
                {$me.emailAddress
                  ? $me.emailAddress
                  : "click to enter your email address"}
                <!-- <input
                    name="emailAddress"
                    id="emailAddress"
                    type="email"
                    class="w-full input input-bordered"
                    on:click="{() => editProfileField(['emailAddress'])}"
                    bind:value="{emailAddress}" /> -->
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- <section class="mx-4 mb-2">
    <Card>
      <div class="text-xs font-bold text-left text-primary whitespace-nowrap">
        <Label key="dapps.o-passport.pages.settings.currencyDisplay"  />
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
