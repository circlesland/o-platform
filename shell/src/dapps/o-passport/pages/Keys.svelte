<script lang="ts">
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import Card from "src/shared/atoms/Card.svelte";
  import * as bip39 from "bip39";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import {GnosisSafeProxy} from "@o-platform/o-circles/dist/safe/gnosisSafeProxy";
  import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
  import {me} from "../../../shared/stores/me";
  import {onMount} from "svelte";
  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let showPhrase = !localStorage.getItem("circlesKey");
  // TODO: 0x123 is for testing without private key. Needs to be removed later.

  let safeOwners: {[address:string]:{name:string | null, key:string | null, isValid:boolean, isThisDevice:boolean}} = {};
  let safeProxy = new GnosisSafeProxy(RpcGateway.get(), $me.circlesAddress);

  let keys: {address:string, name:string|null, key:string|null, isValid: boolean, isThisDevice:boolean}[] = [];

  onMount(async () => {
    const key = localStorage.getItem("circlesKey");
    if (key) {
      const localAccount = RpcGateway.get().eth.accounts.privateKeyToAccount(key);
      safeOwners[localAccount.address] = {
        name: "This device",
        key: localAccount.privateKey,
        isValid: false,
        isThisDevice: true
      };
    }

    const owners = await safeProxy.getOwners();
    owners.forEach(o => {
      if (safeOwners[o]) {
        safeOwners[o].isValid = true;
      } else {
        safeOwners[o] = {
          name: null,
          key: null,
          isValid: true,
          isThisDevice: false
        };
      }
    });

    keys = Object.keys(safeOwners).map(k =>{
      return {
        ... safeOwners[k],
        address: k
      }
    });
  });

  let name =
    localStorage.getItem("circlesKey") &&
    localStorage.getItem("circlesKey") != "0x123"
      ? bip39.entropyToMnemonic(
          localStorage
            .getItem("circlesKey")
            .substr(2, localStorage.getItem("circlesKey").length - 2)
        )
      : "<no private key>";

  const copy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: { name },
    });
    app.$destroy();
  };

  function show() {
    showPhrase = !showPhrase;
  }

  let addOwnerAddress:string = "";

  async function addOwner() {
    try {
      await safeProxy.addOwnerWithThreshold(
              localStorage.getItem("circlesKey"),
              addOwnerAddress.toLowerCase(),
              1);
    } catch (e) {
      console.error(e);
    }
  }

  async function removeOwner(address:string) {
    try {
      await safeProxy.removeOwner(
              localStorage.getItem("circlesKey"),
              address.toLowerCase());
    } catch (e) {
      console.error(e);
    }
  }
</script>

<SimpleHeader {runtimeDapp} {routable} />

<div class="mx-auto -mt-2 md:w-2/3 xl:w-1/2">
  <input type="text" bind:value={addOwnerAddress} />
  <button on:click={() => addOwner()}>Add owner</button>
  {#each keys as key}
    <section class="flex items-center justify-center mx-4 mb-2">
      <Card>
        <div class="flex flex-col items-start">
          <div>
            Address: {key.address}<br/>
            Name: {key.name}<br/>
            Key: {key.key !== null}<br/>
            IsValid: {key.isValid}
          </div>
          {#if !key.isThisDevice}
            <button on:click={() => removeOwner(key.address)}>Remove</button>
          {/if}
        </div>
      </Card>
    </section>
  {/each}

  <section class="flex items-center justify-center mx-4 mb-1">
    <Card>
      <div class="flex flex-col items-start">
        <h3 class="mr-2 font-bold">My Secret Recovery Code</h3>
      </div>
      <div class="flex justify-end flex-1 text-primary">
        <svg
          class="h-6"
          fill="none"
          on:click="{show}"
          class:hidden="{showPhrase}"
          class:block="{!showPhrase}"
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
          on:click="{show}"
          block="{showPhrase}"
          class:hidden="{!showPhrase}"
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
    </Card>
  </section>
  <!-- {#if showPhrase} -->
  <section class="flex items-center justify-center mx-4 mb-2">
    <Card>
      <div class:blur="{!showPhrase}" class="flex flex-col items-start">
        <div id="clipboard">
          <input type="text" class="hidden" bind:value="{name}" />
          {name}
          <div
            class="relative inline-block text-xs text-primary cursor-pointertext-center -bottom-1"
            on:click="{copy}"
            alt="Copy to Clipboard">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 stroke-current"
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
          </div>
        </div>
      </div>
    </Card>
  </section>
  <!-- {:else}{/if} -->
</div>

<style>
  .blur {
    filter: blur(5px);
  }
</style>
