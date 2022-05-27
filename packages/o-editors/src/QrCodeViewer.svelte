<script lang="ts">
import { EditorContext } from "./editorContext";
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { onMount } from "svelte";
import QRCodeStyling from "qr-code-styling";
import {normalizePromptField} from "@o-platform/o-process/dist/states/prompt";

export let context: EditorContext;
export let size: number = 300;
export let image: string = "/logos/circles.png";

let profileQrcode;

let _context: EditorContext;
$: {
  _context = context;
}

onMount(() => {
  const qrCode = new QRCodeStyling({
    width: size,
    height: size,
    type: "svg",
    data: normalizePromptField(_context.field).get(_context),

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
})

console.log("INNER CONTEXT : ", context);
let inputField: any;
let fieldId = context.isSensitive
  ? Math.random().toString().replace(".", "")
  : context.field;

const submitHandler = () => {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
};

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    submitHandler();
  }
}
</script>

<div class="form-control justify-self-center">
  <div class="w-full">
    <center>
      <div bind:this="{profileQrcode}"></div>
    </center>
  </div>

  <ProcessNavigation on:buttonClick="{submitHandler}" context="{context}" />
</div>
