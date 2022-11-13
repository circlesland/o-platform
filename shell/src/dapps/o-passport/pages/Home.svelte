<script lang="ts">
import CopyToClipboard from "../../../shared/atoms/CopyClipboard.svelte";
import PassportHeader from "../atoms/PassportHeader.svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Profile } from "../../../shared/api/data/types";
import { upsertIdentity } from "../processes/upsertIdentity";

import { Environment } from "../../../shared/environment";

import { AvataarGenerator } from "../../../shared/avataarGenerator";
import { onMount } from "svelte";
import { upsertOrganisation } from "../../o-coop/processes/upsertOrganisation";
import QrCode from "../../../shared/molecules/QrCode/QrCode.svelte";
import { upsertShippingAddress } from "../processes/upsertShippingAddress";
import Label from "../../../shared/atoms/Label.svelte";
import {loadProfile} from "../../../shared/functions/loadProfile";

let name;
let profile: Profile;

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

const options = {};

$: name = profile?.circlesAddress ? profile.circlesAddress : "";

onMount(() => {
  if ($me) {
    profile = $me;
    console.log(profile.shippingAddresses);
  } else {
    profile = undefined;
  }
});

function editProfile(dirtyFlags: { [x: string]: boolean }) {
  if (profile.__typename == "Organisation") {
    window.o.runProcess(upsertOrganisation, profile, {}, Object.keys(dirtyFlags));
  } else {
    window.o.runProcess(upsertIdentity, profile, {}, Object.keys(dirtyFlags));
  }
}
</script>

<PassportHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

{#if profile}
  <div class="flex flex-col px-4 mx-auto mt-8 mb-20 space-y-6 md:w-2/3 xl:w-1/2">
    <div class="flex flex-col w-full p-4 space-y-4 bg-white border rounded-xl border-bordergray">
      <section class="justify-center">
        <div class="flex flex-col w-full space-y-2">
          <div class="text-left text-2xs text-dark-lightest">
            <Label key="dapps.o-passport.pages.home.qrcode" />
          </div>
          <div class="container p-1 pt-2 xs:p-4">
            <center>
              {#if profile}
                <QrCode value="{profile.circlesAddress}" />
              {/if}
            </center>
          </div>
        </div>
      </section>
    </div>
    <div class="flex flex-col w-full p-4 space-y-4 bg-white border rounded-xl border-bordergray">
      <!-- <section class="justify-center">
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          <Label key="dapps.o-passport.pages.home.passion" />
        </div>

        <div class="flex items-center w-full space-x-2 sm:space-x-4">
          <div
            class="text-2xl leading-tight text-left font-heading"
            on:click="{() => editProfile({ dream: true })}">
            {#if profile && profile.dream}
              {profile.dream}
            {:else}<Label key="dapps.o-passport.pages.home.noPassionSet" />{/if}
          </div>
        </div>
      </div>
    </section> -->
      {#if profile.circlesAddress}
        <section class="justify-center">
          <div class="flex flex-col w-full space-y-1">
            <div class="text-left text-2xs text-dark-lightest">
              <Label key="dapps.o-passport.pages.home.address" />
            </div>

            <div class="flex items-center w-full space-x-2 sm:space-x-4">
              <div class="text-left">
                <div class="inline-block break-all" id="clipboard">
                  {#if profile}
                    {profile.circlesAddress ? profile.circlesAddress : ""}

                    <CopyToClipboard text="{name}" let:copy>
                      <svg
                        on:click="{copy}"
                        xmlns="http://www.w3.org/2000/svg"
                        class="inline w-4 h-4 stroke-current text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0
                00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0
                012 2"></path>
                      </svg>
                    </CopyToClipboard>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </section>
      {/if}

      <section class="justify-center">
        <div class="flex flex-col w-full space-y-1">
          <div class="text-left text-2xs text-dark-lightest">
            <Label key="dapps.o-passport.pages.home.postAddress" />
          </div>
          {#if profile.shippingAddresses && profile.shippingAddresses.length}
            {#each profile.shippingAddresses as shippingAddress, index}
              <div class="flex items-center w-full pb-4 space-x-2 cursor-pointer sm:space-x-4">
                <div class="text-left">
                  <div class="inline-block break-all">
                    {shippingAddress.name}<br />
                    {shippingAddress.street}
                    {shippingAddress.house} <br />
                    {shippingAddress.zip}
                    {shippingAddress.city} <br />
                    {shippingAddress.country}
                    <br />
                    <span class:text-alert-dark="{shippingAddress.notificationEmail === null}">
                      {shippingAddress.notificationEmail ? shippingAddress.notificationEmail : "no email address set"}
                    </span>
                  </div>
                  <div>
                    <button
                      on:click="{() => {
                        window.o.runProcess(upsertShippingAddress, {
                          ...shippingAddress,
                          successAction: () => {
                            profile = $me;
                          }
                        });
                      }}"
                      class="mt-1 btn btn-sm btn-primary btn-outline">Edit Address</button>
                  </div>
                </div>
              </div>
            {/each}
          {:else}
            <div>
              <button
                class="btn btn-sm btn-primary"
                on:click="{() => {
                  window.o.runProcess(upsertShippingAddress, {
                    successAction: () => {
                      profile = $me;
                    }
                  });
                }}">Add Address</button>
            </div>
          {/if}
        </div>
      </section>
    </div>
  </div>
{/if}
