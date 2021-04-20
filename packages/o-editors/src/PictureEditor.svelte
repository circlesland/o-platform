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
    answer.data = {
      ...context.data,
      avatar: {
        mimeType: "image/*",
        bytes: imageStore.value
      }
    }
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
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                class="sr-only"
              />
            </label>
            <p class="pl-1">or drag and drop</p>
          </div>
          <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </Dropzone>
  {/if}
</div>
<br />
<ProcessNavigation on:buttonClick={submit} {context} />
