<script>
  import { onMount } from "svelte";
  import UAParser from "ua-parser-js";
  import Icons from "src/shared/molecules/Icons.svelte";

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
  class="relative flex items-center content-center justify-center block
  overflow-hidden "
>
  <div
    id="video-overlay"
    class="absolute z-30 flex flex-col items-stretch content-center w-full
    h-full min-h-full text-center video-overlay "
    style="background-image: url('/images/homepage/circles-home.jpg');
    background-position: center;"
    on:click={() => playVideo()}
  >
    <h1 class="px-5 font-heading text-primary text-4xl md:text-6xl mt-11">
      BE FREE
    </h1>
    <h2 class="px-5 pt-4 text-xl font-thin flex-grow text-white sm:text-3xl ">
      Together we build the universal basic income economy today
    </h2>
    <button class="flex-grow" on:click={() => playVideo()}>
      <div class="inline-flex mt-2">

        <Icons icon="playbutton" />

      </div>
      <div class="pt-0 text-center text-white text-lg sm:pt-2">play video</div>
    </button>
  </div>

  <div
    id="container"
    class="z-10 w-full max-w-full min-w-full min-h-full h-screen"
  >
    <vm-player>
      <vm-vimeo
        video-id="548283844"
        cross-origin="true"
        poster="/images/homepage/circles-home.jpg"
      />
      <!--  -->

      <vm-ui>
        <!-- Vime components. -->
        <vm-click-to-play />
        <vm-spinner />
        <vm-poster />
        <!-- Custom web component. -->
        <tap-sides-to-seek />
      </vm-ui>
    </vm-player>
  </div>
</div>

<style>
  #container {
    width: 100%;
    max-width: 960px;
  }
  .video-overlay {
    /* --tw-bg-opacity: 0.5;
    background-color: rgba(30, 58, 138, var(--tw-bg-opacity)); */
  }
</style>
