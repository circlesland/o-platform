<script>
  import { onMount } from "svelte";
  import UAParser from "ua-parser-js";

  let parser = new UAParser();
  let player;
  let mobile = parser.getResult().device["type"] == "mobile";
  $: player = document.querySelector("vm-player");

  onMount(() => {
    window.player = document.querySelector("vm-player");
    player = document.querySelector("vm-player");

    // Listening to an event.
    // if (mobile) {
    player.addEventListener("vmPlay", (event) => {
      player.enterFullscreen();
    });
    player.addEventListener("vmPlaybackEnded", (event) => {
      player.exitFullscreen();
    });
    // }
  });
  function playVideo() {
    player.play();
    document.getElementById("video-overlay").style.visibility = "hidden";
  }

</script>

<div
  class="relative flex items-center content-center justify-center block overflow-hidden font-circles "
>
  <div
    id="video-overlay"
    class="absolute z-30 grid items-stretch content-center w-full h-full min-h-full text-center grid-row video-overlay "
    on:click={() => playVideo()}
  >
    <h1 class="px-5 font-bold text-white text-md md:text-6xl">
      Be free to live the life you deserve
    </h1>
    <h2 class="px-5 pt-4 text-sm font-thin text-gray-200 sm:text-3xl ">
      together we build today the universal basic income economy of tomorrow.
    </h2>
    <button class="inline-block " on:click={() => playVideo()}>
      <div class="inline-flex mt-2">
        <div
          class="flex items-center justify-center w-10 h-10 pl-1 transition duration-300 transform bg-gray-100 bg-opacity-50 shadow-2xl sm:w-16 sm:h-16 group-hover:scale-110"
        >
          <svg
            class="w-8 h-8 text-white sm:w-10 sm:h-10"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M16.53,11.152l-8-5C8.221,5.958,7.833,5.949,7.515,6.125C7.197,6.302,7,6.636,7,7v10 c0,0.364,0.197,0.698,0.515,0.875C7.667,17.958,7.833,18,8,18c0.184,0,0.368-0.051,0.53-0.152l8-5C16.822,12.665,17,12.345,17,12 S16.822,11.335,16.53,11.152z"
            />
          </svg>
        </div>
      </div>
      <div class="pt-0 text-center text-gray-200 text-opacity-50 sm:pt-2">
        play
      </div>
    </button>
  </div>

  <div
    id="container"
    class="z-10 w-full max-w-full min-w-full min-h-full bg-circlesdarkblue"
  >
    <vm-player>
      <vm-vimeo video-id="548283844" cross-origin="true" />
      <!-- poster="/images/homepage/befree.jpg" -->

      <vm-default-ui />
      <vm-click-to-play />
    </vm-player>
  </div>
</div>

<style>
  #container {
    width: 100%;
    max-width: 960px;
  }
  .video-overlay {
    --tw-bg-opacity: 0.5;
    background-color: rgba(30, 58, 138, var(--tw-bg-opacity));
  }

</style>
