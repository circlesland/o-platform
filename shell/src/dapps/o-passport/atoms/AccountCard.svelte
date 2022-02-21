<script>
import { slide } from "svelte/transition";
import * as bip39 from "bip39";
import CopyToClipboard from "../../../shared/atoms/CopyClipboard.svelte";
import { _ } from "svelte-i18n";

export let key;
let isOpen = false;
const toggle = () => (isOpen = !isOpen);

/* we're currently ONLY showing the current key from localstorage! */
let seedphrase =
  sessionStorage.getItem("circlesKey") &&
  sessionStorage.getItem("circlesKey") != "0x123"
    ? bip39.entropyToMnemonic(
        sessionStorage
          .getItem("circlesKey")
          .substr(2, sessionStorage.getItem("circlesKey").length - 2)
      )
    : "<no private key>";
</script>

<section class="mb-3">
  <div
    class="flex items-center w-full p-3 space-x-2 bg-white rounded-lg shadow-md">
    <div class="flex-col flex-grow">
      <div class="flex flex-row items-center justify-between text-left">
        <div class="flex-grow min-w-0">
          <h2
            class="overflow-hidden text-base whitespace-nowrap overflow-ellipsis">
            {key.address.substr(0, 28) + "..."}
          </h2>
        </div>
        <div
          class="self-end justify-end pl-2 text-right whitespace-nowrap text-primary">
          <span>
            {#if key.encryptedPrivateKey}
              <div on:click="{toggle}">
                <svg
                  class="self-end h-6"
                  fill="none"
                  class:hidden="{isOpen}"
                  class:block="{!isOpen}"
                  xmlns="http://www.w3.org/2000/svg"
                  viewbox="0 0 576 512">
                  <path
                    fill="currentColor"
                    d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48
            241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288
            448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288
            400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31
            95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0
            288 160z"></path>
                </svg>
                <svg
                  class="h-6"
                  fill="none"
                  block="{isOpen}"
                  class:hidden="{!isOpen}"
                  xmlns="http://www.w3.org/2000/svg"
                  viewbox="0 0 640 512">
                  <path
                    fill="currentColor"
                    d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79
            17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41
            197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13
            144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0
            81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320
            64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23
            6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0
            22.46-2.81l19.64-25.27a16 16 0 0
            0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416
            256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64
            46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92
            143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"></path>
                </svg>
              </div>
            {/if}
          </span>
        </div>
      </div>
      {#if key.encryptedPrivateKey && key.encryptedPrivateKey.base64CypherText}
        {#if isOpen}
          <div
            class="flex flex-col w-full mt-4 space-y-1"
            transition:slide="{{ duration: 300 }}">
            <div class="mb-1 text-left text-2xs text-dark-lightest">
              {$_("dapps.o-passport.atoms.accountCard.secretRecoveryCode")}
            </div>
            <div class="flex items-center w-full">
              <div class="text-sm text-left break-all">
                {seedphrase}
                <CopyToClipboard text="{seedphrase}" let:copy>
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
              </div>
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</section>

<style>
svg {
  transition: transform 0.2s ease-in;
}

[aria-expanded="true"] svg {
  transform: rotate(0.25turn);
}
</style>
