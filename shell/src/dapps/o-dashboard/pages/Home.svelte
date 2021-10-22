<script lang="ts">
import { me } from "../../../shared/stores/me";
import { onMount } from "svelte";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import { BN } from "ethereumjs-util";
import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
import { push } from "svelte-spa-router";
import Icons from "../../../shared/molecules/Icons.svelte";
import OpenLogin, { LOGIN_PROVIDER } from "@toruslabs/openlogin";

import DashboardHeader from "../atoms/DashboardHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { unlockKey } from "../../o-onboarding/processes/unlockKey/unlockKey";
import { KeyManager } from "../../o-passport/data/keyManager";
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
  const pk = sessionStorage.getItem("circlesKey");
  disableBanking = !pk;
  if (!pk) {
    unlock();
    return;
  }

  accountAddress =
    RpcGateway.get().eth.accounts.privateKeyToAccount(pk).address;

  accountBalance = await RpcGateway.get().eth.getBalance(accountAddress);

  // TODO: The "fundHint" could still be relevant but must be re-specified first
  //showFundHint = new BN(accountBalance).lt(new BN(safeDeployThreshold));
};

function unlock() {
  window.o.runProcess(unlockKey, {
    successAction: async () => {
      await init();
    },
  });
}

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
    inviteLink = `${window.location.protocol}//${window.location.host}/#/friends/${$me.id}`;
  }
}
</script>

<template lang="pug">

DashboardHeader(runtimeDapp="{runtimeDapp}" routable="{routable}")
div.mx-auto(class="md:w-2/3 xl:w-1/2")
  div.m-4.mb-20
    section.mb-4(on:click!="{() => loadLink('/dashboard/invites')}")
      button.btn.btn-primary.btn-block Create Invites
        
    div.grid.grid-cols-2.gap-4.text-base.auto-rows-fr.dashboard-grid(class='lg:grid-cols-3')
      section.flex.items-center.justify-center.bg-white.rounded-lg.shadow-md.cursor-pointer.dashboard-card(on:click!="{() => loadLink('/passport/profile')}")
        div.flex.flex-col.items-center.w-full.p-4.pt-6.justify-items-center
          div.pt-2.text-primary
            Icons(icon="dashpassport")
          div.mt-4.text-3xl.font-heading.text-dark passport

      section.flex.items-center.justify-center.bg-white.rounded-lg.shadow-md.cursor-pointer.dashboard-card(on:click!="{() => loadLink('/friends')}")
        div.flex.flex-col.items-center.w-full.p-4.pt-6.justify-items-center
          div.pt-2.text-primary
            Icons(icon="dashfriends")
          div.mt-4.text-3xl.font-heading.text-dark friends

      if showFundHint || disableBanking
        section.flex.items-center.justify-center.bg-white.rounded-lg.shadow-md.cursor-pointer.dashboard-card
          div.flex.flex-col.items-center.w-full.p-4.pt-6.justify-items-center
            div.pt-2.text-primary-lightest
              Icons(icon="dashbanking")
            div.mt-4.text-3xl.font-heading.text-dark banking
      else
        section.flex.items-center.justify-center.bg-white.rounded-lg.shadow-md.cursor-pointer.dashboard-card(on:click!="{() => loadLink(showFundHint ? '/dashboard' : '/banking/transactions')}")
          div.flex.flex-col.items-center.w-full.p-4.pt-6.justify-items-center
            div.pt-2.text-primary
              Icons(icon="dashbanking")
            div.mt-4.text-3xl.font-heading.text-dark banking
      
      section.flex.items-center.justify-center.bg-white.rounded-lg.shadow-md.cursor-pointer.dashboard-card(on:click!="{() => loadLink('/marketplace/stream')}")
        div.flex.flex-col.items-center.w-full.p-4.pt-6.justify-items-center
          div.pt-2.text-primary
            Icons(icon="dashmarket")
          div.mt-4.text-3xl.font-heading.text-dark market

      section.flex.items-center.justify-center.bg-white.rounded-lg.shadow-md.cursor-pointer.dashboard-card(on:click!="{() => loadLink('/coops/organisations')}")
        div.flex.flex-col.items-center.w-full.p-4.pt-6.justify-items-center
          div.pt-2.text-primary
            Icons(icon="dashcoop")
          div.mt-4.text-3xl.font-heading.text-dark coops
</template>

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
</style>
