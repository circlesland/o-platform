<script lang="ts">
import "../../../shared/css/tailwind.css";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { onMount } from "svelte";
import { ApiClient } from "../../../shared/apiConnection";
import {
  Organisation,
  OrganisationsByAddressDocument,
  OrganisationsByAddressQueryVariables,
  SessionInfo,
  Shop,
} from "../../../shared/api/data/types";
import { getSessionInfo } from "../../o-passport/processes/identify/services/getSessionInfo";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import { Environment } from "../../../shared/environment";

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
    ApiClient.query<Organisation[], OrganisationsByAddressQueryVariables>(OrganisationsByAddressDocument, {
      addresses: [address],
    }),
    getSessionInfo(),
  ]);

  const hostProfileResult = <Organisation[]>queryResults[0];
  const sessionInfo = <SessionInfo>queryResults[1];

  hostProfile = hostProfileResult.length > 0 ? hostProfileResult[0] : undefined;

  shop = hostProfile?.shops?.length > 0 ? hostProfile.shops[0] : undefined;

  loading = false;

  if (!shop) {
    return;
  }

  sessionStorage.setItem(
    "desiredRoute",
    JSON.stringify({
      dappId: "gallery",
      "1": "nfts",
    })
  );

  Environment.setShopMetadata(shop.id, JSON.stringify({ minted: false, mintedAt: undefined }));

  if (sessionInfo.hasProfile && hostProfile?.shops.length > 0) {
    window.runInitMachine();
    return;
  }
});
</script>

<div
  id="video-overlay"
  class="relative flex items-center content-center justify-center h-screen overflow-hidden"
  style=" background-position: center; background:
  url('/images/market/acidpunkstroke22.png') no-repeat center center fixed;
  -webkit-background-size: cover; -moz-background-size: cover;
  -o-background-size: cover; background-size: cover; ">
  <SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />
</div>
