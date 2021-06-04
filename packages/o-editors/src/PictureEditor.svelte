<script lang="ts">
  import { EditorContext } from "./editorContext";
  import { onMount } from "svelte";
  import Cropper from "svelte-easy-crop";
  import Dropzone from "svelte-file-dropzone";
  import ProcessNavigation from "./ProcessNavigation.svelte";
  import { Continue } from "@o-platform/o-process/dist/events/continue";

  export let context: EditorContext;

  let maxSize: number = 10000000;
  let crop = { x: 0, y: 0 };
  let cropData = {
    detail: { pixels: { x: 0, y: 0, width: 300, height: 300 } },
  };
  let zoom = 1;
  let aspect = 1 / 1;
  let cropShape = "round";
  let cropCanvas;
  let resizeCanvas;
  let ctx;
  let image;
  let uploadFile;

  $: uploadMessage = "";

  let files = {
    accepted: [],
    rejected: [],
  };

  let imageStore = { value: null, isValid: false };

  function handleFilesSelect(e) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];

    if (files.rejected.length > 0) {
      uploadMessage = files.rejected[0].errors[0].message;
      files = {
        accepted: [],
        rejected: [],
      };
    } else {
      addedfile(files.accepted[0]);
    }
  }

  onMount(async () => {
    ctx = cropCanvas.getContext("2d");
    // cropCanvas = document.createElement("cropCanvas");
  });

  const addedfile = (file) => {
    const reader = new FileReader();

    reader.addEventListener("loadend", (e) => {
      uploadFile = Buffer.from(<ArrayBuffer>reader.result);
      context.editorDirtyFlags[context.field] = true;
    });

    reader.readAsArrayBuffer(file);
    files.accepted = [];
  };

  function clearImage() {
    context.editorDirtyFlags[context.field] = true;
    imageStore.value = null;
    uploadFile = null;
    image = null;
  }

  function cropImage(detail) {
    try {
      cropData = detail;
      image = new Image();
      image.src = `data:image/*;base64,${uploadFile.toString("base64")}`;

      image.onload = function () {
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        cropCanvas.width = detail.detail.pixels.width;
        cropCanvas.height = detail.detail.pixels.height;

        // const ctx = cropCanvas.getContext("2d");

        ctx.drawImage(
          image,
          detail.detail.pixels.x * scaleX,
          detail.detail.pixels.y * scaleY,
          detail.detail.pixels.width * scaleX,
          detail.detail.pixels.height * scaleY,
          0,
          0,
          detail.detail.pixels.width,
          detail.detail.pixels.height
        );

        resizeCanvas.width = 512;
        resizeCanvas.height = 512;
        const resizeCanvasCtx = resizeCanvas.getContext("2d");
        resizeCanvasCtx.drawImage(
                cropCanvas,
                0,
                0,
                512,
                512
        );

        resizeCanvas.toBlob((blob) => {
          const reader = new FileReader();

          reader.addEventListener("loadend", () => {
            imageStore.value = Buffer.from(<ArrayBuffer>reader.result);
            imageStore.isValid = true;
          });

          reader.readAsArrayBuffer(blob);
        }, "image/jpg", 72);

        return true;
      };
    } catch (e) {
      console.error("ERROR ", e);
    }
  }

  $: {
    if (imageStore && imageStore.value) {
      imageStore.isValid = true;
      setTimeout(() => {});
    }
  }

  function submit() {
    const answer = new Continue();
    answer.data = context.data;
    answer.data[context.field] = {
      mimeType: "image/jpeg",
      bytes: imageStore.value,
    };
    context.process.sendAnswer(answer);
  }
</script>

<label class="label block text-center" for={context.field}>
  <span class="label-text">{@html context.params.label}</span>
</label>
<div class="w-full h-full">
  <canvas
          style="display:none"
          bind:this={cropCanvas}
          id="cropCanvas"
          width="300"
          height="300"
  />
  <canvas
          style="display:none"
          bind:this={resizeCanvas}
          id="resizeCanvas"
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
        on:cropcomplete={cropImage}
      />
    </div>
  {:else}
    <Dropzone
      on:drop={handleFilesSelect}
      multiple={false}
      {maxSize}
      accept="image/png,image/jpeg,image/jpg"
    >
      <div class="mt-1 flex justify-center px-6 pt-5 pb-6 ">
        <div class="space-y-1 text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="flex text-sm text-gray-600">
            <label
              for="file-upload"
              class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload a file</span>
            </label>
            <p class="pl-1">or drag and drop</p>
          </div>
          <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          <p class="text-error">{uploadMessage}</p>
        </div>
      </div>
    </Dropzone>
  {/if}
</div>
<br />
<ProcessNavigation on:buttonClick={submit} {context} />
