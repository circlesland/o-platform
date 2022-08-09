<script type="ts">
import { ProfileEvent, Sale, SaleEvent } from "../../../shared/api/data/types";
import QrScanner from "qr-scanner";
import { onDestroy, onMount } from "svelte";
import { push } from "svelte-spa-router";
import { showToast } from "../../../shared/toast";
import { _ } from "svelte-i18n";
import { mySales } from "../../../shared/stores/mySales";

let saleEvent: ProfileEvent;
let sale: SaleEvent;

let video: HTMLVideoElement;
let scanner: QrScanner;
let camQrResult: HTMLElement;
let camList: HTMLElement;
let camHasCamera: HTMLElement;
let statusText: string = "";

$: {
  camQrResult = camQrResult;
}

onDestroy(() => {
  scanner.stop();
});

async function loadSale(id) {
  scanner.stop();
  statusText = window.i18n(
    "dapps.o-marketplace.pages.scanPurchase.verifyingOrder"
  );

  saleEvent = await mySales.findByPickupCode(id);
  if (saleEvent) {
    sale = <SaleEvent>saleEvent.payload;
  } else {
    sale = null;
  }

  if (!sale || sale.invoice.sellerSignature) {
    statusText = window.i18n(
      "dapps.o-marketplace.pages.scanPurchase.invalidOrderCode"
    );
    startScanner();
    return;
  }

  mySales.completeSale(sale.invoice.id).then(function () {
    push(`#/marketplace/my-sales/${sale.invoice.id}`);
    showToast(
      "success",
      window.i18n(
        "dapps.o-marketplace.pages.scanPurchase.purchaseMarkedAsDelivered"
      )
    );
    return sale;
  });
}

async function setResult(label, result) {
  label.textContent = result.data;
  label.style.color = "teal";

  clearTimeout(label.highlightTimeout);
  label.highlightTimeout = setTimeout(
    () => (label.style.color = "inherit"),
    100
  );

  await loadSale(result.data);
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
      // console.log("CAMQRRESULT", camQrResult); keep this off, it'll drive you crazy!
    },
    highlightScanRegion: true,
    highlightCodeOutline: true,
  });

  startScanner();

  // TODO: Maybe we want a 'you don't have a camera message? ... nahh
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
    <h1 class="text-3xl uppercase font-heading">
      <Label key="dapps.o-marketplace.pages.scanPurchase.scanToHandOut"  />
    </h1>
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
          ><Label key="dapps.o-marketplace.pages.scanPurchase.cameraDefault"  /></option>
        <option value="user"
          ><Label key="dapps.o-marketplace.pages.scanPurchase.cameraUserFacing" /></option>
      </select>
    </div>

    <div class="mt-4 text-center">
      <b><Label key="dapps.o-marketplace.pages.scanPurchase.detectedQrCode"  /></b>
      <span id="cam-qr-result" bind:this="{camQrResult}"
        ><Label key="dapps.o-marketplace.pages.scanPurchase.none"  /></span>
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

:global(#video-container.example-style-1
    .scan-region-highlight-svg, #video-container.example-style-1
    .code-outline-highlight) {
  stroke: #64a2f3 !important;
}

:global(#video-container.example-style-2) {
  position: relative;
  width: max-content;
  height: max-content;
  overflow: hidden;
}
:global(#video-container.example-style-2 .scan-region-highlight) {
  border-radius: 30px;
  outline: rgba(0, 0, 0, 0.25) solid 50vmax;
}
:global(#video-container.example-style-2 .scan-region-highlight-svg) {
  display: none;
}
:global(#video-container.example-style-2 .code-outline-highlight) {
  stroke: rgba(255, 255, 255, 0.5) !important;
  stroke-width: 15 !important;
  stroke-dasharray: none !important;
}
</style>
