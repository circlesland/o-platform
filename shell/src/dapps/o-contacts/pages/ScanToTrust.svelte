<script type="ts">
import {
  ProfileEvent,
  Profile,
  Contact,
  CommonTrust,
  CommonTrustQueryVariables,
  CommonTrustDocument,
  ContactPoint,
  ContactDirection,
  EventType,
} from "../../../shared/api/data/types";
import QrScanner from "qr-scanner";
import { onDestroy, onMount } from "svelte";
import { push } from "svelte-spa-router";
import { showToast } from "../../../shared/toast";
import { _ } from "svelte-i18n";
import { mySales } from "../../../shared/stores/mySales";
import { contacts } from "../../../shared/stores/contacts";
import { me } from "../../../shared/stores/me";
import { ApiClient } from "../../../shared/apiConnection";
import { setTrust } from "../../../dapps/o-banking/processes/setTrust";
import { Environment } from "../../../shared/environment";
import { ok, err, Result } from "neverthrow";
import Label from "../../../shared/atoms/Label.svelte";

let video: HTMLVideoElement;
let scanner: QrScanner;
let camQrResult: HTMLElement;
let camList: HTMLElement;
let camHasCamera: HTMLElement;
let statusText: string = "";
let isMe: boolean = false;
let commonTrusts: CommonTrust[] = [];
let profile: Profile;
let contact: Contact;

enum ScanStatus {
  ErrorOwnProfile = 1,
  ErrorAlreadyTrusted,
  ErrorUnknown,
  Success,
}

$: {
  camQrResult = camQrResult;
}

onDestroy(() => {
  scanner.stop();
});

async function tryTrust(id) {
  scanner.stop();

  setTimeout(async () => {
    let trustCheck = await setProfile(id);

    if (trustCheck.isErr()) {
      trustCheck.mapErr((errorMessage) => {
        statusText = errorMessage;
      });
      startScanner();
      return;
    }
    if (trustCheck.isOk()) {
      console.log("Cool");
    }
  }, 500);
}

async function setProfile(id: string) {
  try {
    const c = await contacts.findBySafeAddress(id);
    if (!c) {
      return;
    }

    contact = c;
    profile = c.contactAddress_Profile;

    if ($me.circlesAddress !== contact.contactAddress) {
      commonTrusts = (
        await ApiClient.query<CommonTrust[], CommonTrustQueryVariables>(
          CommonTrustDocument,
          {
            safeAddress1: $me.circlesAddress.toLowerCase(),
            safeAddress2: contact.contactAddress.toLowerCase(),
          }
        )
      ).filter((o) => o.profile);
    } else {
      return err("You can't trust yourself, or do you? ;)");
    }

    profile = contact.contactAddress_Profile;

    if (contact.metadata) {
      const trustMetadata: ContactPoint = contact.metadata.find(
        (p) => p.name === EventType.CrcTrust
      );
      let trustIn = 0;
      let trustOut = 0;

      if (trustMetadata) {
        trustMetadata.directions.forEach((d, i) => {
          if (d == ContactDirection.In) {
            trustIn = parseInt(trustMetadata.values[i]);
          } else if (d == ContactDirection.Out) {
            trustOut = parseInt(trustMetadata.values[i]);
          }
        });
      }

      if (trustOut) {
        return err("You are already trusting this user.");
      } else {
        window.o.runProcess(setTrust, {
          trustLimit: 100,
          trustReceiver: id,
          safeAddress: $me.circlesAddress,
          hubAddress: Environment.circlesHubAddress,
          privateKey: sessionStorage.getItem("circlesKey"),
        });
        return ok({ codeValid: true });
      }
    }
  } catch (error) {
    return err(error);
  }
}

async function setResult(label, result) {
  label.textContent = result.data;
  label.style.color = "teal";

  clearTimeout(label.highlightTimeout);
  label.highlightTimeout = setTimeout(
    () => (label.style.color = "inherit"),
    100
  );

  await tryTrust(result.data);
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
      Scan Profile QR Code to Instant-Trust
    </h1>
  </div>
  <div class="w-full text-center">
    <span class="break-all text-alert-dark">{statusText}</span>
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
          ><Label key="dapps.o-marketplace.pages.scanPurchase.cameraDefault"></Label></option>
        <option value="user"
          ><Label key="dapps.o-marketplace.pages.scanPurchase.cameraUserFacing"></Label></option>
      </select>
    </div>

    <div class="mt-4 text-center">
      <b><Label key="dapps.o-marketplace.pages.scanPurchase.detectedQrCode"></Label></b>
      <span id="cam-qr-result" bind:this="{camQrResult}"
        ><Label key="dapps.o-marketplace.pages.scanPurchase.none"></Label></span>
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
