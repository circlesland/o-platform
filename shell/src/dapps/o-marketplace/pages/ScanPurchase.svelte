<script type="ts">
import QrScanner from "qr-scanner";
import { onMount } from "svelte";

let videoContainer = document.getElementById("video-container");
let camHasCamera = document.getElementById("cam-has-camera");

let camHasFlash = document.getElementById("cam-has-flash");
let flashToggle = document.getElementById("flash-toggle");
let flashState = document.getElementById("flash-state");

let fileSelector = document.getElementById("file-selector");
let fileQrResult = document.getElementById("file-qr-result");

function setResult(label, result) {
  label.textContent = result.data;

  label.style.color = "teal";
  clearTimeout(label.highlightTimeout);
  label.highlightTimeout = setTimeout(
    () => (label.style.color = "inherit"),
    100
  );
  scanner.stop();
}

let video: HTMLVideoElement;
let startButton;
let stopButton;
let scanner: QrScanner;
let camQrResult: HTMLElement;
let camList: HTMLElement;

$: {
  camQrResult = camQrResult;
}

// ####### Web Cam Scanning #######
onMount(() => {
  scanner = new QrScanner(video, (result) => setResult(camQrResult, result), {
    onDecodeError: (error) => {
      // console.log("CAMQRRESULT", camQrResult);
      // No result.. i'm looping here like A LOT!
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
        option.text = camera.label;
        camList.add(option);
      })
    );
  });

  QrScanner.hasCamera().then(
    (hasCamera) => (camHasCamera.textContent = hasCamera)
  );

  scanner.setInversionMode("both");
  // for debugging
  window.scanner = scanner;

  camList.addEventListener("change", (event) => {
    scanner.setCamera(event.target.value).then(updateFlashAvailability);
  });

  flashToggle.addEventListener("click", () => {
    scanner
      .toggleFlash()
      .then(
        () => (flashState.textContent = scanner.isFlashOn() ? "on" : "off")
      );
  });
});
</script>

<h1>Scan from WebCam:</h1>
<div id="video-container" class="style-1">
  <video id="qr-video" bind:this="{video}"><track kind="captions" /></video>
</div>

<div>
  <b>Preferred camera:</b>
  <select id="cam-list" bind:this="{camList}">
    <option value="environment" selected>Environment Facing (default)</option>
    <option value="user">User Facing</option>
  </select>
</div>

<br />
<b>Detected QR code: </b>
<span id="cam-qr-result" bind:this="{camQrResult}">None</span>

<style>
#video-container {
  line-height: 0;
}

#video-container.style-1 .scan-region-highlight-svg,
#video-container.style-1 .code-outline-highlight {
  stroke: #64a2f3 !important;
}

hr {
  margin-top: 32px;
}
</style>
