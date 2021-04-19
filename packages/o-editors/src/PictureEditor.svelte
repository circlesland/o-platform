<script lang="ts">
  import { EditorContext } from "./editorContext";
  import { onMount } from "svelte";
  import Cropper from "svelte-easy-crop";
  import Dropzone from "svelte-file-dropzone";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";

  export let context: EditorContext;

  let crop = { x: 0, y: 0 };
  let zoom = 1;
  let aspect = 1 / 1;
  let cropShape = "round";

  let canvas;
  let ctx;
  let image;
  let uploadFile;

  let files = {
    accepted: [],
    rejected: [],
  };

  let imageStore = { value: null, isValid: false };

  function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
    console.log("ACCEPTED: ", files.accepted);
    addedfile(files.accepted[0]);
  }

  onMount(async () => {
    canvas = HTMLCanvasElement = <HTMLCanvasElement>(
      document.getElementById("cropCanvas")
    );

    ctx = canvas.getContext("2d");
  });

  const addedfile = (file) => {
    const reader = new FileReader();

    reader.addEventListener("loadend", (e) => {
      uploadFile = Buffer.from(<ArrayBuffer>reader.result);
      loadImageIntoCanvas();
    });

    reader.readAsArrayBuffer(file);
    files.accepted = [];
  };

  function clearImage() {
    imageStore.value = null;
    uploadFile = null;
    image = null;
  }

  function loadImageIntoCanvas() {
    image = new Image();
    image.src = `data:image/*;base64,${uploadFile.toString("base64")}`;

    image.onload = function () {
      ctx.drawImage(
        image,
        70,
        20, // Start at 70/20 pixels from the left and the top of the image (crop),
        50,
        50, // "Get" a `50 * 50` (w * h) area from the source image (crop),
        0,
        0, // Place the result at 0, 0 in the canvas,
        100,
        100
      ); // With as width / height: 100 * 100 (scale)
    };
  }

  function cropImage(cropData) {
    const sourceX = cropData.detail.pixels.x;
    const sourceY = cropData.detail.pixels.y;
    const sourceWidth = cropData.detail.pixels.width;
    const sourceHeight = cropData.detail.pixels.height;
    const destWidth = sourceWidth;
    const destHeight = sourceHeight;
    const destX = canvas.width / 2 - destWidth / 2;
    const destY = canvas.height / 2 - destHeight / 2;
    const mimeType = "image/png";

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destX,
      destY,
      destWidth,
      destHeight
    );

    // convert to blob which i'm not sure if actually necessary :D
    canvas.toBlob((blob) => {
      const reader = new FileReader();

      reader.addEventListener("loadend", () => {
        const arrayBuffer = reader.result;
        imageStore.value = Buffer.from(<ArrayBuffer>reader.result);
        imageStore.isValid = true;
      });

      reader.readAsArrayBuffer(blob);
    }, mimeType);

    // This kind of happens every time the user 'moves' the cropping tool, maybe this isn't necessary?
    // dispatch("validated", imageStore.isValid);
  }

  $: {
    if (imageStore && imageStore.value) {
      imageStore.isValid = true;
      setTimeout(() => {
        // dispatch("validated", imageStore.isValid);
        console.log("CROPPUS ", imageStore);
      });
    }
  }

  function submit() {
    const answer = new Continue();
    answer.data = imageStore.value;
    context.process.sendAnswer(answer);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      submit();
    }
  }
</script>

<label class="label" for={context.fieldName}>
  <span class="label-text">{context.params.label}</span>
</label>
<div class="w-full h-full">
  <canvas
    style="visibility: hidden; position:absolute; left:-8096px; top:-8096px;"
    id="cropCanvas"
    width="300"
    height="300"
  />
  {#if uploadFile}
    <div class="relative" style="top: -30px;">
      <span on:click={() => clearImage()} class="float-right cursor-pointer">
        clear
      </span>
    </div>
    <div class="w-full h-96 relative">
      <Cropper
        image={`data:image/png;base64,${uploadFile.toString("base64")}`}
        bind:crop
        bind:zoom
        bind:aspect
        bind:cropShape
        on:cropcomplete={(cropData) => cropImage(cropData)}
      />
    </div>
  {:else}
    <Dropzone
      on:drop={handleFilesSelect}
      multiple={false}
      accept="image/png,image/jpeg,image/jpg"
    />
  {/if}
</div>
<br />
<ProcessNavigation on:buttonClick={submit} {context} />
