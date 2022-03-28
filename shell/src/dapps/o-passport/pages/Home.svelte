<script lang="ts">
import CopyToClipboard from "../../../shared/atoms/CopyClipboard.svelte";
import PassportHeader from "../atoms/PassportHeader.svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Profile } from "../../../shared/api/data/types";
import { upsertIdentity } from "../processes/upsertIdentity";
import { _ } from "svelte-i18n";

import { Environment } from "../../../shared/environment";
import QRCodeStyling from "qr-code-styling";
import { AvataarGenerator } from "../../../shared/avataarGenerator";
import { onMount } from "svelte";
import { upsertOrganisation } from "../../o-coop/processes/upsertOrganisation";

let name;
let profile: Profile;
let profileQrcode;

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

const options = {};

$: name = profile?.circlesAddress ? profile.circlesAddress : "";

onMount(() => {
  if ($me) {
    profile = $me;
  } else {
    profile = undefined;
  }

  const qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg",
    data: profile.circlesAddress,

    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "Q",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.7,
      margin: 6,
      crossOrigin: "anonymous",
    },
    dotsOptions: {
      // color: "#081B4A",
      gradient: {
        type: "linear", // 'radial'
        rotation: 0,
        colorStops: [
          { offset: 0, color: "#20d9a2" },
          { offset: 1, color: "#003399" },
        ],
      },
      type: "dots",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    cornersSquareOptions: {
      color: "#35495E",
      type: "extra-rounded",
    },
    cornersDotOptions: {
      color: "#35495E",
      type: "dot",
    },
    image: "/logos/circles.png",
  });
  qrCode.append(profileQrcode);
});

function editProfile(dirtyFlags: { [x: string]: boolean }) {
  if (profile.__typename == "Organisation") {
    window.o.runProcess(
      upsertOrganisation,
      profile,
      {},
      Object.keys(dirtyFlags)
    );
  } else {
    window.o.runProcess(upsertIdentity, profile, {}, Object.keys(dirtyFlags));
  }
}
</script>

<PassportHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="flex flex-col px-4 mx-auto mb-20 -mt-3 space-y-6 md:w-2/3 xl:w-1/2">
  <div
    class="flex flex-col w-full p-4 space-y-4 bg-white rounded-lg shadow-md cardborder">
    <section class="justify-center">
      <div class="flex flex-col w-full space-y-2">
        <div class="text-left text-2xs text-dark-lightest">
          {$_("dapps.o-passport.pages.home.qrcode")}
        </div>
        <div class="container">
          <center>
            <div bind:this="{profileQrcode}"></div>
          </center>
        </div>
      </div>
    </section>
  </div>
  <div
    class="flex flex-col w-full p-4 space-y-4 bg-white rounded-lg shadow-md cardborder">
    <!-- <section class="justify-center">
      <div class="flex flex-col w-full space-y-1">
        <div class="mb-1 text-left text-2xs text-dark-lightest">
          {$_("dapps.o-passport.pages.home.passion")}
        </div>

        <div class="flex items-center w-full space-x-2 sm:space-x-4">
          <div
            class="text-2xl leading-tight text-left font-heading"
            on:click="{() => editProfile({ dream: true })}">
            {#if profile && profile.dream}
              {profile.dream}
            {:else}{$_("dapps.o-passport.pages.home.noPassionSet")}{/if}
          </div>
        </div>
      </div>
    </section> -->
    {#if profile && profile.circlesAddress}
      <section class="justify-center">
        <div class="flex flex-col w-full space-y-1">
          <div class="text-left text-2xs text-dark-lightest">
            {$_("dapps.o-passport.pages.home.address")}
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
  </div>
</div>
