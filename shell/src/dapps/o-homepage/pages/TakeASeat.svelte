<script lang="ts">
  import "../../../shared/css/tailwind.css";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {onMount} from "svelte";
  import {ApiClient} from "../../../shared/apiConnection";
  import {
    Organisation, OrganisationsByAddressDocument, OrganisationsByAddressQueryVariables, SessionInfo, Shop
  } from "../../../shared/api/data/types";
  import {getSessionInfo} from "../../o-passport/processes/identify/services/getSessionInfo";
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import {Environment} from "../../../shared/environment";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  export let address = "";
  export let table = "";

  let loading = true;
  let hostProfile: Organisation;
  let shop: Shop;

  onMount(async () => {
    sessionStorage.removeItem("desiredRoute");

    const queryResults = await Promise.all([
      ApiClient.query<Organisation[], OrganisationsByAddressQueryVariables>(
        OrganisationsByAddressDocument,
        {addresses: [address]}
      )
      , getSessionInfo()
    ]);

    const hostProfileResult = <Organisation[]>queryResults[0];
    const sessionInfo = <SessionInfo>queryResults[1];

    hostProfile = hostProfileResult.length > 0
      ? hostProfileResult[0]
      : undefined;

    shop = hostProfile?.shops?.length > 0
      ? hostProfile.shops[0]
      : undefined;

    loading = false;

    if (!shop) {
      return;
    }

    sessionStorage.setItem("desiredRoute", JSON.stringify({
      dappId: "marketplace",
      "1": "list",
      "2": shop.id
    }));

    Environment.setShopMetadata(shop.id, JSON.stringify({ Table: parseInt(table) }));

    if (sessionInfo.hasProfile && hostProfile?.shops.length > 0) {
      window.runInitMachine();
      return;
    }
  });
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="mb-20 -mt-3 ">
    <!-- <div class="flex flex-wrap items-stretch space-x-4 space-y-8"> -->
    {#if shop}
        <section class="flex items-start px-4 mx-auto mb-4 md:w-2/3 xl:w-1/2 rounded-xl">
            <div class="flex flex-col w-full">
                <header class="rounded-xl">
                    <div class="relative overflow-hidden bg-white rounded-xl image-wrapper">
                        <img src="{shop.smallBannerUrl}"
                             alt="{shop.name}"
                             class="w-full rounded-xl opacity-60 object-position: center center;  " />
                        <div class="absolute right-0 pt-1 pb-1 pl-4 pr-2 mt-2 text-xl rounded-l-full sm:pb-2 sm:pt-3 sm:text-3xl font-heading top-2 bg-light-lightest">
                            <span class="inline-block">{shop.name}</span>
                        </div>
                    </div>
                </header>
            </div>
        </section>
        <section>
            <h1 class="m-4 text-center">Welcome at {hostProfile.name}!</h1>
            <h2 class="m-4 text-center">Click the sign-in button below access the shop.</h2>
        </section>
    {/if}
</div>