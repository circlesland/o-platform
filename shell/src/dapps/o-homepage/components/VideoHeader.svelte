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
    document.getElementById("video-overlay").style.display = "none";
  }
</script>

<div
  id="video-overlay"
  class="relative flex items-center content-center justify-center h-screen overflow-hidden"
  style=" background-position: center; background:
  url('/images/homepage/circles-home.jpg') no-repeat center center fixed;
  -webkit-background-size: cover; -moz-background-size: cover;
  -o-background-size: cover; background-size: cover; "
>
  <div
    class="absolute z-30 flex flex-col items-stretch content-center w-full h-full min-h-full text-center video-overlay "
    on:click={() => playVideo()}
  >
    <h1 class="px-5 text-4xl font-heading text-primary md:text-6xl mt-11">
      BE FREE
    </h1>
    <h2 class="flex-grow px-5 pt-4 text-xl font-thin text-white sm:text-3xl ">
      Together we build the universal basic income economy today
    </h2>
    <button class="flex-grow" on:click={() => playVideo()}>
      <div class="inline-flex mt-2">

        <Icons icon="playbutton" />

      </div>
      <div class="pt-0 text-lg text-center text-white sm:pt-2">play video</div>
    </button>
  </div>
</div>
<div
  id="container"
  class="z-10 w-full h-screen max-w-full min-w-full min-h-full"
>
  <vm-player class="h-screen">
    <vm-vimeo
      video-id="548283844"
      class="h-screen"
      cross-origin="true"
      poster="/images/homepage/circles-home.jpg"
    />
    <!--  -->

    <vm-default-ui no-controls>
      <vm-click-to-play />
      <!-- We setup the default controls and pass in any options.  -->
      <vm-default-controls hide-on-mouse-leave active-duration="2000" />
    </vm-default-ui>

  </vm-player>
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
