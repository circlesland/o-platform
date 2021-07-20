<script lang="ts">
  import DappFrameContentMobile from "./DappFrameContentMobile.svelte";
  import DappFrameContentDesktop from "./DappFrameContentDesktop.svelte";

  import UAParser from "ua-parser-js";

  export let params: {
    dappId: string;
    "1": string | null;
    "2": string | null;
    "3": string | null;
    "4": string | null;
    "5": string | null;
    "6": string | null;
  };

  const uaParser = new UAParser();

  let detectedDevice = uaParser.getDevice();
  let isMobile = true;

  if (detectedDevice && detectedDevice.type != "mobile") {
    isMobile = false;
  } else {
    isMobile = true;
  }
</script>

{#if isMobile}
  <DappFrameContentMobile {params} />
{:else}
  <DappFrameContentDesktop {params} />
{/if}
