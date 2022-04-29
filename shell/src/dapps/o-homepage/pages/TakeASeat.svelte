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

    hostProfile = hostProfileResult.length > 0 ? hostProfileResult[0] : undefined;

    if (sessionInfo.hasProfile && hostProfile?.shops.length > 0) {
      sessionStorage.setItem("desiredRoute", JSON.stringify({
        dappId: "marketplace",
        "1": "list",
        "2": hostProfile?.shops[0].id
      }));
      window.runInitMachine();
      return;
    }

    loading = false;
    shop = hostProfile?.shops[0];

    if (!hostProfile) {
      return;
    }
  });
</script>


<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<main>
    <div class="mx-auto md:w-2/3 xl:w-1/2">
        <div class="flex flex-col space-y-10">
            {#if hostProfile}
                <section class="m-4 -mb-4 text-center">
                    <h1>Welcome at {hostProfile.name}!</h1>
                    Please take a seat at table {table}.
                </section>

                {#if shop}
                    <section class="flex items-start m-4 rounded-xl"
                             class:cursor-pointer="{shop.enabled}">
                        <div class="flex flex-col w-full ">
                            <div class="m-4 ">
                            </div>
                            <header class=" rounded-xl headerImageContainer">
                                <div class="relative rounded-xl image-wrapper">
                                    <img
                                            src="{shop.largeBannerUrl}"
                                            alt=""
                                            class="w-full rounded-xl"/>
                                    <div
                                            class="absolute right-0 py-2 pt-3 pl-4 pr-2 mt-2 text-3xl rounded-l-full font-heading top-2 bg-light-lightest">
                                        <span class="inline-block">{shop.name}</span>
                                    </div>
                                </div>
                            </header>
                        </div>
                    </section>
                {:else}
                    <div class="mx-auto md:w-2/3 xl:w-1/2 mt-12">
                        <div class="m-4 mb-40 ">
                            Welcome at {hostProfile.name}!<br/>
                            Please take a seat at table {table}.
                        </div>
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</main>