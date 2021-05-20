<script lang="ts">
  import { dashboard } from "../../o-dashboard.manifest";
  import DashboardHeader from "../atoms/DashboardHeader.svelte";
  import { me } from "../../../shared/stores/me";
  import { onDestroy, onMount } from "svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import { INVITE_VALUE } from "src/dapps/o-passport/processes/invite/invite";
  import { PageManifest } from "@o-platform/o-interfaces/dist/pageManifest";
  import { DappManifest } from "@o-platform/o-interfaces/dist/dappManifest";
  import { getLastLoadedDapp, getLastLoadedPage } from "../../../loader";
  import { Subscription } from "web3-core-subscriptions";

  $: me;

  function buyXats() {
    window.o.publishEvent(
      dashboard.actions.find((o) => o.key == "xats").event(undefined)
    );
  }

  let accountAddress: string = "";
  let accountBalance: string = "";
  let safeDeployThreshold: string = "200000000000000000";
  let inviteThreshold: string = "";
  let invitePersonCount: number = 0;
  let invitePersonCountString: string = "0 People";

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;

  let presets = [10, 20, 50];
  let subscription: Subscription<any>;

  onMount(async () => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();

    const pk = localStorage.getItem("circlesKey");
    if (!pk) {
      return;
    }

    async function updateBalance() {
      accountAddress =
        RpcGateway.get().eth.accounts.privateKeyToAccount(pk).address;
      if ($me && $me.circlesAddress) {
        accountBalance = parseFloat(
          RpcGateway.get().utils.fromWei(
            await RpcGateway.get().eth.getBalance($me.circlesAddress),
            "ether"
          )
        ).toFixed(2);
        invitePersonCount = Math.floor(
          (parseFloat(accountBalance) - INVITE_VALUE) / INVITE_VALUE
        );
        if (invitePersonCount == 1) {
          invitePersonCountString = `1 Person`;
        } else if (invitePersonCount == 0 || invitePersonCount == -1) {
          invitePersonCountString = `0 People`;
        } else {
          invitePersonCountString = `${invitePersonCount} People`;
        }
      } else {
        accountBalance = parseFloat(
          RpcGateway.get().utils.fromWei(
            await RpcGateway.get().eth.getBalance(accountAddress),
            "ether"
          )
        ).toFixed(2);
        invitePersonCount = Math.floor(
          (parseFloat(accountBalance) - INVITE_VALUE) / INVITE_VALUE
        );
        if (invitePersonCount == 1) {
          invitePersonCountString = `1 Person`;
        } else if (invitePersonCount == 0 || invitePersonCount == -1) {
          invitePersonCountString = `0 People`;
        } else {
          invitePersonCountString = `${invitePersonCount} People`;
        }
      }
    }

    await updateBalance();

    subscription = RpcGateway.get().eth.subscribe(
      "newBlockHeaders",
      async (error, log) => {
        updateBalance();
      }
    );
  });

  onDestroy(() => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });

  const copy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: { name: accountAddress },
    });
    app.$destroy();
  };
</script>

<DashboardHeader showBackArrow={true} />

<div class="mx-4 -mt-6">
  <section class="flex items-center justify-center mb-2">
    <div class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow">
      <div class="text-xs font-bold text-left text-primary font-circles">
        BECOME A HUB
      </div>
      <div class="flex items-center w-full space-x-2 sm:space-x-6">
        <div class="flex-grow text-left ">
          <div class="max-w-full">
            <p>
              CirclesLand is built on a energy efficient blockchain (xDai) with
              very small transaction fees. 0.01$ will give you 300-500
              transactions. We recommended to have at least <strong
                >{INVITE_VALUE.toFixed(2)} xDai
              </strong>
              (={INVITE_VALUE.toFixed(2)} $) to fuel your daily transactions.<br
              />
              If you have more than {INVITE_VALUE.toFixed(2)} xDai, you can use it
              to invite others you know and who might not be familiar enough with
              getting xDai for themselves.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="flex items-center justify-center mb-2 ">
    <div class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow">
      <div class="text-xs font-bold text-left text-primary font-circles">
        GET XDAI
      </div>
      <div class="flex items-center w-full space-x-2 sm:space-x-6">
        <div class="flex-grow text-left ">
          <div class="max-w-full">
            <div class="flex flex-col items-center text-center">
              <div class="">You can currently invite</div>
              <div class="">
                <p class="text-3xl">{invitePersonCountString}</p>
                <p class="text-l text-light">
                  ({accountBalance} xDai )
                </p>
              </div>
              {#if invitePersonCount > 0}
                <div class="mt-4">
                  <p class="text-2xl">
                    Great! You have enough xDai to invite new people.
                  </p>
                  <p class="mt-2">
                    To invite people, just follow their invite links and click
                    the "invite" button on their profile page.
                  </p>
                </div>
              {:else}
                <div class="flex flex-row mt-4 space-x-6">
                  {#each presets as preset}
                    <a
                      href="https://buy.ramp.network/?userAddress={accountAddress}&swapAsset=XDAI&swapAmount={preset}000000000000000000"
                      target="_blank"
                      class="cursor-pointer"
                    >
                      <div
                        class="text-white cursor-pointer card compact side bg-primary font-circles"
                      >
                        <div
                          class="flex-row items-center space-x-4 cursor-pointer card-body"
                        >
                          <label for="input" class="flex-0"
                            ><div
                              class="text-sm font-bold tracking-wider sm:text-lg"
                            >
                              {Math.floor(preset / INVITE_VALUE)} INVITES
                            </div>
                            <p class="text-xs sm:text-l">({preset} xDai)</p>
                          </label>
                        </div>
                      </div>
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="flex items-center justify-center mb-2 text-circlesdarkblue ">
    <div class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow">
      <div class="text-xs font-bold text-left text-primary font-circles">
        ALTERNATIVES
      </div>
      <div class="flex items-center w-full space-x-2 sm:space-x-6">
        <div class="flex-grow ">
          <div class="text-left">
            You can transfer xDai from any other wallet or exchange. <br />
            Just send your preferred amount (at least {INVITE_VALUE} xDai) to the
            address below to get you started:
          </div>
          <div class="mt-4">
            <div class="text-xs text-center break-all" id="clipboard">
              <input type="text" class="hidden" bind:value={accountAddress} />
              <p class="text-2xl">{accountAddress}</p>
              <div
                class="relative inline-block text-xs text-lighttext-center -bottom-1"
                on:click={copy}
                alt="Copy to Clipboard"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 stroke-current transform group-hover:rotate-[-4deg] transition"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>
