<script lang="ts">
import QRCodeStyling from "qr-code-styling";
import { onMount } from "svelte";

export let value: string;
export let size: number = 300;
export const image: string = "/logos/circles.png";

let profileQrcode;

onMount(() => {
  const qrCode = new QRCodeStyling({
    width: size,
    height: size,
    type: "svg",
    data: value,

    margin: 0,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: "Q",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.2,
      margin: 6,
      crossOrigin: "anonymous",
    },
    dotsOptions: {
      color: "#000000",

      type: "square",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    cornersSquareOptions: {
      color: "#000000",
      type: "square",
    },
    cornersDotOptions: {
      color: "#000000",
      type: "square",
    },
  });
  qrCode.append(profileQrcode);
});
</script>

<div bind:this="{profileQrcode}"></div>
