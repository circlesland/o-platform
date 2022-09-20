<script lang="ts">
import getCroppedImg from "../Cropper/canvasUtils";
import Dropzone from "svelte-file-dropzone";
import { createEventDispatcher } from "svelte";
const dispatch = createEventDispatcher();
import Cropper from "svelte-easy-crop";
import Resizer from "react-image-file-resizer";

export let cropShape: string = "rect";
export let aspect: number;
export let maxWidth: number = 500;

const resize = Resizer.imageFileResizer;
let rawImgs;

let crop = { x: 0, y: 0 };
let zoom = 1;

let pixelCrop, croppedImage;
let files = {
  accepted: [],
  rejected: [],
};
let fileSelected = false;

$: uploadMessage = "";
$: image = null;

$: {
  if (!aspect) {
    if (cropShape && cropShape == "rect") {
      aspect = 4 / 3;
    }
    if (cropShape && cropShape == "square") {
      aspect = 1 / 1;
    }
  }
}

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

let resizeImage = (file) => {
  return new Promise((resolve, reject) => {
    resize(dataURLtoBlob(file), maxWidth, maxWidth / aspect, "JPEG", 100, 0, (uri) => resolve(uri), "base64");
  });
};

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
    let imageFile = files.accepted[0];
    let reader = new FileReader();
    image = null;
    reader.onload = (e) => {
      image = e.target.result;
    };

    reader.readAsDataURL(imageFile);
    fileSelected = true;
  }
}

let profilePicture, style;

function previewCrop(e) {
  pixelCrop = e.detail.pixels;

  const { x, y, width } = e.detail.pixels;
  const scale = 200 / width;
  profilePicture.style = `margin: ${-y * scale}px 0 0 ${-x * scale}px; width: ${
    profilePicture.naturalWidth * scale
  }px;`;
}

function reset() {
  files = {
    accepted: [],
    rejected: [],
  };
  croppedImage = null;
  image = null;
}

async function submit() {
  croppedImage = await getCroppedImg(image, pixelCrop);
  let resizedImage = await resizeImage(croppedImage);
  dispatch("submit", {
    croppedImage: resizedImage,
  });
}
</script>

<div>
  <div class="w-full h-full">
    {#if !image}
      <Dropzone on:drop="{handleFilesSelect}" multiple="{false}" accept="image/png,image/jpeg,image/jpg">
        <div class="flex justify-center px-6 pt-5 pb-6 mt-1 ">
          <div class="space-y-1 text-center">
            <svg
              class="w-12 h-12 mx-auto text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true">
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"></path>
            </svg>
            <div class="flex text-sm text-gray-600">
              <label
                for="file-upload"
                class="relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                <span>Upload a file</span>
              </label>
              <p class="pl-1">or drag and drop</p>
            </div>
            <p class="text-xs text-gray-500">PNG, JPG, GIF</p>
            <p class="text-error">{uploadMessage}</p>
          </div>
        </div>
      </Dropzone>
    {:else}
      <div style="position: relative; width: 100%; height: 300px;">
        <Cropper image="{image}" bind:crop bind:zoom bind:aspect bind:cropShape on:cropcomplete="{previewCrop}" />
      </div>

      <!-- we need this, otherwise the zoom doesnt work. though it needs to stay hidden. -->
      <div class="hidden prof-pic-wrapper">
        <img bind:this="{profilePicture}" class="prof-pic" src="{image}" alt="Profile example" style="{style}" />
      </div>
    {/if}
  </div>

  {#if fileSelected}
    <div class="flex justify-between w-full p-4">
      <button class="btn btn-primary btn-outline" on:click="{() => reset()}">Remove Image</button>
      <button class="btn btn-primary" on:click="{submit}">Save Image</button>
    </div>
  {/if}
</div>

<style>
.prof-pic-wrapper {
  height: 200px;
  width: 200px;
  position: relative;
  border: solid;
  overflow: hidden;
}

.prof-pic {
  position: absolute;
}
</style>
