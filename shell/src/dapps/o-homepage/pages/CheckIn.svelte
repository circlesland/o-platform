<script lang="ts">
import "../../../shared/css/tailwind.css";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { onMount } from "svelte";
import {
  Shop,
} from "../../../shared/api/data/types";
import { getSessionInfo } from "../../o-passport/processes/identify/services/getSessionInfo";
import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
export let address = "";

let loading = true;
let shop: Shop;

onMount(async () => {
  sessionStorage.removeItem("desiredRoute");
  const sessionInfo = await getSessionInfo();

  sessionStorage.setItem(
    "desiredRoute",
    JSON.stringify({
      dappId: "gallery",
      "1": "nfts",
    })
  );

  if (!sessionStorage.getItem("notFirst")) {
    window.runInitMachine();
  }

  sessionStorage.setItem("notFirst", "true");
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
