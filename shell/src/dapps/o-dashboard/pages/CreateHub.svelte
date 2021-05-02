<script lang="ts">
  import { dashboard } from "../../o-dashboard.manifest";
  import DashboardHeader from "../atoms/DashboardHeader.svelte";
  import { me } from "../../../shared/stores/me";
  import {onMount} from "svelte";
  import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import {INVITE_VALUE} from "src/dapps/o-passport/processes/invite/invite";
  import {PageManifest} from "@o-platform/o-interfaces/dist/pageManifest";
  import {DappManifest} from "@o-platform/o-interfaces/dist/dappManifest";
  import {getLastLoadedDapp, getLastLoadedPage} from "../../../loader";

  $: me;

  function buyXats() {
    window.o.publishEvent(
      dashboard.actions.find((o) => o.key == "xats").event(undefined)
    );
  }

  let accountAddress:string = "";
  let accountBalance:string = "";
  let safeDeployThreshold:string = "200000000000000000";
  let inviteThreshold:string = "";
  let invitePersonCount:number = 0;
  let invitePersonCountString:string = "0 People";
  let showFundHint:boolean = false;
  let inviteLink:string = "";

  let lastLoadedPage: PageManifest;
  let lastLoadedDapp: DappManifest<any>;

  onMount(async () => {
    lastLoadedPage = getLastLoadedPage();
    lastLoadedDapp = getLastLoadedDapp();

    const pk = localStorage.getItem("circlesKey");
    if (!pk) {
      return;
    }

    async function updateBalance() {
      accountAddress = RpcGateway.get().eth.accounts.privateKeyToAccount(pk).address;
      accountBalance = parseFloat(RpcGateway.get().utils.fromWei(await RpcGateway.get().eth.getBalance(accountAddress), "ether")).toFixed(2);
      invitePersonCount = Math.floor(parseFloat(accountBalance) / INVITE_VALUE);
      if (invitePersonCount == 1) {
        invitePersonCountString = `1 Person`
      } else {
        invitePersonCountString = `${invitePersonCount} People`
      }
    }

    await updateBalance();

    RpcGateway.get().eth.subscribe("newBlockHeaders", async (error, log) => {
      updateBalance();
    });
  })

  const copy = () => {
    const app = new CopyClipBoard({
      target: document.getElementById("clipboard"),
      props: {name: inviteLink},
    });
    app.$destroy();
  };

  $: {
    if ($me) {
      inviteLink = `${window.location.protocol}://${window.location.host}/#/passport/profile/${$me.id}`
    }
  }
</script>

<DashboardHeader />


<section class="flex items-center justify-center mb-8">
  <div class="flex items-center bg-white shadow px-2  w-full rounded-sm">
    <div class="mr-4  px-4 py-2  text-center -ml-3 text-secondary">
    </div>
    <div class="flex items-center">
      <p class="text-xl">Create a hub </p>
      <div class="flex justify-end flex-1 mr-1 text-primary">
      </div>
    </div>
  </div>
</section>
<section class="flex items-center justify-center mb-8">
  <div class="flex items-center">
    <div class="mr-4  px-4 py-2  text-center -ml-3 text-secondary">
    </div>
    <div class="text-center">
      <div>
        <p>On blockchains, each transaction costs a small fee to keep the network running. Circles builds on the xDai chain and we recommended to have at least {INVITE_VALUE} xDai to fuel your daily transactions.</p>
        <br/>
        <p>If you have more than {INVITE_VALUE} xDai, you can use it to <i>invite others you know and who might not be familiar enough with the process</i> of buying xDai for themselves.</p>
      </div>
    </div>
    <div class="mr-4  px-4 py-2  text-center -ml-3 text-secondary">
    </div>
  </div>
</section>

<section class="flex items-center justify-center mb-8">
  <div class="flex items-center bg-white shadow px-2  w-full rounded-sm">
    <div class="mr-4  px-4 py-2  text-center -ml-3 text-secondary">
    </div>
    <div class="flex items-center">
      <p class="text-xl">Get xDai</p>
      <div class="flex justify-end flex-1 mr-1 text-primary">
      </div>
    </div>
  </div>
</section>
<section class="flex items-center justify-center mb-8">
  <div class="flex items-center">
  </div>
  <div class="flex items-center">
    <div class="text-center">
      You can currently invite
    </div>
    <div class="flex justify-end flex-1 mr-1 text-primary">
    </div>
  </div>
</section>
<section class="flex items-center justify-center mb-8">
  <div class="flex items-center">
  </div>
  <div class="flex items-center">
    <div class="text-center">
      <p class="text-3xl">{invitePersonCountString}</p>
      <p class="text-l">({accountBalance} xDai)</p>
    </div>
    <div class="flex justify-end flex-1 mr-1 text-primary">
    </div>
  </div>
</section>
<section class="flex items-center justify-center mb-8">
  <div class="flex items-center">
  </div>
  <div class="flex items-center">
    <div class="text-center">
      Use one of the presets below to buy xDai on <a href="https://ramp.network/">ramp.network</a>.<br/>
      The presets point to your current account so this is an easy way to get started.
    </div>
    <div class="flex justify-end flex-1 mr-1 text-primary">
    </div>
  </div>
</section>
<section class="flex items-center justify-center mb-8">
  <div class="flex items-center">
  </div>
  <div class="flex items-center">
    <a
      href="https://buy.ramp.network/?userAddress={accountAddress}&swapAsset=XDAI&swapAmount=12000000000000000000"
      target="_blank"
    >
      <div class="text-center">
        <p class="text-3xl">75 People</p>
        <p class="text-l">(12 xDai)</p>
      </div>
    </a>
    <a
      href="https://buy.ramp.network/?userAddress={accountAddress}&swapAsset=XDAI&swapAmount=25000000000000000000"
      target="_blank"
    >
      <div>
        <p class="text-3xl">150 People</p>
        <p class="text-l">(20 xDai)</p>
      </div>
    </a>
    <a
      href="https://buy.ramp.network/?userAddress={accountAddress}&swapAsset=XDAI&swapAmount=50000000000000000000"
      target="_blank"
    >
      <div>
        <p class="text-3xl">375 People</p>
        <p class="text-l">(50 xDai)</p>
      </div>
    </a>
    <div class="flex justify-end flex-1 mr-1 text-primary">
    </div>
  </div>
</section>
<section class="flex items-center justify-center mb-8">
  <div class="flex items-center">
  </div>
  <div class="flex items-center">
    <div class="text-center">
      Once the transaction on ramp is completed, come back and refresh this page.
    </div>
    <div class="flex justify-end flex-1 mr-1 text-primary">
    </div>
  </div>
</section>

<section class="flex items-center justify-center mb-8">
  <div class="flex items-center bg-white shadow px-2  w-full rounded-sm">
    <div class="mr-4  px-4 py-2  text-center -ml-3 text-secondary">
    </div>
    <div class="flex items-center">
      <p class="text-xl">Alternatives</p>
      <div class="flex justify-end flex-1 mr-1 text-primary">
      </div>
    </div>
  </div>
</section>
<section class="flex items-center justify-center mb-8">
  <div class="flex items-center">
  </div>
  <div class="flex items-center">
    <div class="text-center">
      You can transfer xDai from any other wallet or exchange. Just send your preferred amount (at least {INVITE_VALUE} xDai) to the address below to get you started:
    </div>
    <div class="flex justify-end flex-1 mr-1 text-primary">
    </div>
  </div>
</section>
<section class="flex items-center justify-center mb-8">
  <div class="flex items-center">
    <div class="mr-4  px-4 py-2  text-center -ml-3 text-secondary">
    </div>
    <div class="flex items-center">
      <div class="break-all text-xs" id="clipboard">
        <input type="text" class="hidden" bind:value={accountAddress}/>
        <p class="text-2xl">{accountAddress}</p>
        <div
          class="inline-block text-light cursor-pointertext-center text-xs relative -bottom-1"
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
      <div class="flex justify-end flex-1 mr-1 text-primary">
      </div>
    </div>
  </div>
</section>