<script type="ts">
import { Sale } from "../../../shared/api/data/types";
import QrScanner from "qr-scanner";
import { onMount } from "svelte";
import { sales } from "../../../shared/stores/sales";
import { push } from "svelte-spa-router";
import { showToast } from "../../../shared/toast";

let sale: Sale;
let video: HTMLVideoElement;
let scanner: QrScanner;
let camQrResult: HTMLElement;
let camList: HTMLElement;
let camHasCamera: HTMLElement;
let statusText: string = "";

$: {
  camQrResult = camQrResult;
}

async function loadSale(id) {
  scanner.stop();
  statusText = "verifying Order...";
  sale = await sales.findByPickupCode(id);
  console.log("ID: ", id);
  console.log("SALE: ", sale);
  if (!sale) {
    statusText = "invalid Order Code, please try a different one.";
    startScanner();
    return;
  }

  await sales.completeSale(sale.invoices[0].id);
  // showToast("success", "Purchase marked as delivered");
  // push("#/marketplace/my-sales");
  return sale;
}

async function setResult(label, result) {
  label.textContent = result.data;
  label.style.color = "teal";

  clearTimeout(label.highlightTimeout);
  label.highlightTimeout = setTimeout(
    () => (label.style.color = "inherit"),
    100
  );

  loadSale(result.data);
}

function startScanner() {
  scanner.start().then(() => {
    // List cameras after the scanner started to avoid listCamera's stream and the scanner's stream being requested
    // at the same time which can result in listCamera's unconstrained stream also being offered to the scanner.
    // Note that we can also start the scanner after listCameras, we just have it this way around in the demo to
    // start the scanner earlier.
    QrScanner.listCameras(true).then((cameras) =>
      cameras.forEach((camera) => {
        const option = document.createElement("option");
        option.value = camera.id;
        option.text = `Camera: ${camera.label}`;
        camList.add(option);
      })
    );
  });
  scanner.setInversionMode("both");
}
// ####### Web Cam Scanning #######
onMount(() => {
  scanner = new QrScanner(video, (result) => setResult(camQrResult, result), {
    onDecodeError: (error) => {
      console.log("CAMQRRESULT", camQrResult);
    },
    highlightScanRegion: true,
    highlightCodeOutline: true,
  });

  startScanner();

  // QrScanner.hasCamera().then(
  //   (hasCamera) => (camHasCamera.textContent = hasCamera)
  // );

  camList.addEventListener("change", (event) => {
    scanner.setCamera(event.target.value);
  });
});
</script>

<section class="flex flex-col items-center justify-center p-6 space-y-4">
  <div class="w-full text-center">
    <h1 class="text-3xl uppercase font-heading">Scan to hand out purchase</h1>
  </div>
  <div class="w-full text-center">
    <span class="text-dark-lightest">{statusText}</span>
  </div>

  <div class="w-full">
    <div id="video-container" class="default-style">
      <video id="qr-video" bind:this="{video}"><track kind="captions" /></video>
    </div>

    <div class="mt-4">
      <select
        id="cam-list"
        bind:this="{camList}"
        class="w-full border select input">
        <option value="environment" selected
          >Camera: Environment Facing (default)</option>
        <option value="user">Camera: User Facing</option>
      </select>
    </div>

    <div class="mt-4 text-center">
      <b>Detected QR code: </b>
      <span id="cam-qr-result" bind:this="{camQrResult}">None</span>
    </div>
  </div>
  <!-- <slot name="EditorActionButtons">
    <div class="w-full">BUTTONS</div>
  </slot> -->
</section>

<style>
#video-container {
  line-height: 0;
}

#video-container.example-style-1 .scan-region-highlight-svg,
#video-container.example-style-1 .code-outline-highlight {
  stroke: #64a2f3 !important;
}

#video-container.example-style-2 {
  position: relative;
  width: max-content;
  height: max-content;
  overflow: hidden;
}
#video-container.example-style-2 .scan-region-highlight {
  border-radius: 30px;
  outline: rgba(0, 0, 0, 0.25) solid 50vmax;
}
#video-container.example-style-2 .scan-region-highlight-svg {
  display: none;
}
#video-container.example-style-2 .code-outline-highlight {
  stroke: rgba(255, 255, 255, 0.5) !important;
  stroke-width: 15 !important;
  stroke-dasharray: none !important;
}

hr {
  margin-top: 32px;
}
</style>
