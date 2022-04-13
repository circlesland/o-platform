<script lang="ts">
import QRCodeStyling from "qr-code-styling";
import { onMount } from "svelte";

export let value: string;
export let size: number = 300;
export let image: string = "/logos/circles.png";

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
      // color: "#081B4A",
      gradient: {
        type: "linear", // 'radial'
        rotation: 0,
        colorStops: [
          { offset: 0, color: "#20d9a2" },
          { offset: 1, color: "#003399" },
        ],
      },
      type: "dots",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    cornersSquareOptions: {
      color: "#0A2262",
      type: "dot",
    },
    cornersDotOptions: {
      color: "#0A2262",
      type: "dot",
    },
    image: image,
  });
  qrCode.append(profileQrcode);
});
</script>

<div bind:this="{profileQrcode}"></div>
