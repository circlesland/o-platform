<script type="ts">
import {
  AggregateType,
  CompleteSaleDocument,
  InvoiceDocument,
  Profile,
  QueryInvoiceArgs,
  Sale,
} from "../../../shared/api/data/types";
import QrScanner from "qr-scanner";
import { onMount } from "svelte";

import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { sales } from "../../../shared/stores/sales";
import { push } from "svelte-spa-router";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let videoContainer = document.getElementById("video-container");

let camHasFlash = document.getElementById("cam-has-flash");
let flashToggle = document.getElementById("flash-toggle");
let flashState = document.getElementById("flash-state");

let fileSelector = document.getElementById("file-selector");
let fileQrResult = document.getElementById("file-qr-result");
let isLoading = false;
let sale: Sale;

let video: HTMLVideoElement;
let startButton;
let stopButton;
let scanner: QrScanner;
let camQrResult: HTMLElement;
let camList: HTMLElement;
let camHasCamera: HTMLElement;

$: {
  camQrResult = camQrResult;
}

async function loadSale(id) {
  sale = await sales.findByPickupCode(id);
  console.log("SALE: ", sale);
  if (!sale) {
    return;
  }
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
  const foundSale = await loadSale(result.data);
  console.log("FOUND", foundSale);

  if (foundSale) {
    scanner.stop();
    console.log("SALES BEFORE", sales);
    // await sales.completeSale(sale.invoices[0].id);
    console.log("SALES AFTER", sales);
    // push(`#/marketplace/my-sales/${foundSale.id}`);
  }
}
// ####### Web Cam Scanning #######
onMount(() => {
  scanner = new QrScanner(video, (result) => setResult(camQrResult, result), {
    onDecodeError: (error) => {
      // console.log("CAMQRRESULT", camQrResult);
    },
    highlightScanRegion: true,
    highlightCodeOutline: true,
  });

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

  // QrScanner.hasCamera().then(
  //   (hasCamera) => (camHasCamera.textContent = hasCamera)
  // );

  scanner.setInversionMode("both");

  camList.addEventListener("change", (event) => {
    scanner.setCamera(event.target.value);
  });
});
</script>

<section class="flex flex-col items-center justify-center p-6 space-y-4">
  <div class="w-full text-center">
    <h1 class="text-3xl uppercase font-heading">Scan to hand out purchase</h1>
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
