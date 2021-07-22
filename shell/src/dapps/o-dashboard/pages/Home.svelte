<script lang="ts">
  import { me } from "../../../shared/stores/me";
  import { onMount } from "svelte";
  import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
  import { BN } from "ethereumjs-util";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import { push } from "svelte-spa-router";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import AdjacencyGraph from "../../../shared/pathfinder/CirclesAdjacencyGraph.svelte";
  import TopNav from "src/shared/atoms/TopNav.svelte";

  const { mySafe } = require("src/dapps/o-banking/stores/safe");
  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  $: me;

  let disableBanking: boolean = false;

  let accountAddress: string = "";
  let accountBalance: string = "";
  let safeDeployThreshold: string = "200000000000000000";
  let showFundHint: boolean = false;
  let inviteLink: string = "";

  const init = async () => {
    const pk = localStorage.getItem("circlesKey");
    if (!pk || localStorage.getItem("isCreatingSafe") !== "true") {
      disableBanking = !pk;
      return;
    }

    accountAddress = RpcGateway.get().eth.accounts.privateKeyToAccount(pk)
      .address;

    if (localStorage.getItem("isCreatingSafe")) {
      showFundHint = true;
      return;
    }
    accountBalance = await RpcGateway.get().eth.getBalance(accountAddress);
    showFundHint = new BN(accountBalance).lt(new BN(safeDeployThreshold));
  };

  onMount(init);

  const copy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: { name: inviteLink },
    });
    app.$destroy();
  };

  function loadLink(link, external = false) {
    if (external) {
      window.open(link, "_blank").focus();
    } else {
      push(link);
    }
  }

  const sub = window.o.events.subscribe((event) => {
    if (event.type !== "shell.refresh") {
      return;
    }
    init();
  });

  let mySafeAddress: string;

  $: {
    if ($me) {
      inviteLink = `${window.location.protocol}//${window.location.host}/#/banking/profile/${$me.id}`;
    }
  }
</script>

<TopNav {runtimeDapp} {routable} />

<!-- <DashboardHeader /> -->
{#if $me && $me.circlesAddress}
  <div class="relative w-full" style="max-height: 400px">
    <section class="mb-4 bg-white shadow-md">
      <AdjacencyGraph
        classes="grid w-full bg-white rounded-lg shadow"
        address={$me.circlesAddress}
        maxHeight="h-96"
      />
    </section>
  </div>
{/if}
<div class="mx-auto md:w-2/3 xl:w-1/2">

  <div class="m-4">

    {#if showFundHint}
      <!-- Create safe  showFundHint-->
      <section class="mt-4 mb-4">
        <div class="w-full p-4 bg-white rounded-lg shadow">
          <div class="px-4 py-2 mr-4 -ml-3 text-center " />
          <div style="text-align: center">
            <p class="w-64 m-auto mt-2 text-2xl font-bold text-dark">
              You're almost there.
            </p>
            <p class="mt-4 ">
              To unlock your Circles basic income, you need to get invited by a
              CirclesLand citizen.
            </p>
            <div class="mt-4 mb-4 text-xs break-all" id="clipboard">
              <input type="text" class="hidden" bind:value={inviteLink} />
              <div class="inline-block text-2xl">
                <button class="btn btn-primary" on:click={copy}>
                  Copy Invite Link
                </button>
              </div>

              <div class="block mt-2 text-sm text-light ">{inviteLink}</div>
            </div>
            <p class="text">
              If you don't know anybody who has Circles yet, ask nicely in our
              <a
                href="https://discord.gg/4DBbRCMnFZ"
                target="_blank"
                class="btn-link"
              >
                Discord
              </a>
              if someone can invite you.
            </p>
            <p class="pb-4 mt-4 text-xs">
              alternatively,
              <a href="#/dashboard/become-a-hub" class="btn-link">
                become an invite hub
              </a>
            </p>
            <div class="mr-1 text-primary" />
          </div>
        </div>
      </section>
    {:else if $mySafe}
      <section
        class="mb-4"
        on:click={() => loadLink('/dashboard/become-a-hub')}
      >
        <button class="btn btn-primary btn-block">
          Grow your trust network now
        </button>
      </section>

      <!-- Create safe  -->
      <!-- <section class="mb-4">
      <div class="w-full px-2 pb-8 -mt-3 bg-white rounded-lg shadow">
        <div class="px-4 py-2 mr-4 -ml-3 text-center " />
        <div class="text-center">
          <p class="w-full m-auto mt-2 text-2xl font-bold text-gradient">
            Grow the basic income economy!
          </p>
          <p class="mt-4 text-lg ">
            xxxxxxx/1.000.000.000 Progress
          </p>
          <div class="w-full px-2 m-auto">
            <progress
              class="h-1 progress progress-accent "
              value={12}
              max="100"
            />
          </div> 
          <p class="mt-4 text">
            Help your family, friends and others to get onboard by <a
              href="/#/dashboard/become-a-hub"
              class="btn-link">becoming an invite hub</a
            >
          </p>
          <div class="mr-1 text-primary" />
        </div>
      </div>
    </section> -->
    {/if}

    <div
      class="grid grid-cols-2 gap-4 text-base auto-rows-fr sm:grid-cols-3
      dashboard-grid"
    >
      <!-- PASSPORT  -->

      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md
        cursor-pointer dashboard-card"
        on:click={() => loadLink('/passport/profile')}
      >
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center"
        >
          <div class="pt-2 text-primary">
            <Icons icon="dashpassport" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">passport</div>
        </div>
      </section>

      <!-- CONTACTS  -->

      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md
        cursor-pointer dashboard-card"
        on:click={() => loadLink('/contacts')}
      >
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center"
        >
          <div class="pt-2 text-primary">
            <Icons icon="dashpassport" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">friends</div>
        </div>
      </section>

      <!-- BANKING -->
      {#if showFundHint || disableBanking}
        <section
          class="flex items-center justify-center bg-white rounded-lg shadow-md
          dashboard-card text-base-300 "
        >
          <div
            class="flex flex-col items-center w-full p-4 pt-6
            justify-items-center"
          >
            <div class="pt-2 text-primary">
              <Icons icon="dashbanking" />
            </div>
            <div class="mt-4 text-3xl font-heading text-base-300">banking</div>
          </div>
        </section>
      {:else}
        <section
          class="flex items-center justify-center bg-white rounded-lg shadow-md
          dashboard-card cursor-pointerbg-white"
          on:click={() => loadLink(showFundHint ? '/dashboard' : '/banking/transactions')}
        >
          <div
            class="flex flex-col items-center w-full p-4 pt-6
            justify-items-center"
          >
            <div class="pt-2 text-primary">
              <Icons icon="dashbanking" />
            </div>
            <div class="mt-4 text-3xl font-heading text-dark">banking</div>
          </div>
        </section>
      {/if}

      <!-- Market -->

      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md
        cursor-pointer dashboard-card"
        on:click={() => loadLink('/marketplace/stream')}
      >
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center"
        >
          <div class="pt-2 text-primary">
            <Icons icon="dashmarket" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">market</div>
        </div>
      </section>

      <!-- Chat -->

      <section
        class="flex items-center justify-center bg-white rounded-lg shadow-md
        cursor-pointer dashboard-card "
        on:click={() => loadLink('https://discord.gg/4DBbRCMnFZ', true)}
      >
        <div
          class="flex flex-col items-center w-full p-4 pt-6 justify-items-center"
        >
          <div class="pt-2 text-primary">
            <Icons icon="dashchat" />
          </div>
          <div class="mt-4 text-3xl font-heading text-dark">chat</div>
        </div>
      </section>
    </div>
  </div>
</div>

<style>
  .dashboard-grid {
    grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
    grid-auto-rows: 1fr;
  }
  @media (min-width: 640px) {
    .dashboard-grid {
      grid-template-columns: repeat(3, minmax(8rem, 1fr));
    }
  }

  .dashboard-grid::before {
    content: "";
    width: 0;
    padding-bottom: 100%;
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }

  .dashboard-grid > *:first-child {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }
  /* .dashboard-card {
    width: 100%;
    padding-bottom: 100%;
    position: relative;
    background-color: #2980b9;
  } */
</style>
