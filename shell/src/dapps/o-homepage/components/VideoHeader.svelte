<script lang="ts">
  import { onMount } from "svelte";
  import UAParser from "ua-parser-js";
  import Icons from "src/shared/molecules/Icons.svelte";

  let parser = new UAParser();
  let player: any;
  let isFullscreen: boolean = false;
  let isMobile: boolean = parser.getResult().device["type"] == "mobile";
  $: player = document.querySelector("vm-player");

  onMount(() => {
    window.player = document.querySelector("vm-player");
    player = document.querySelector("vm-player");

    player.addEventListener("vmPlay", (event) => {
      player.enterFullscreen();
      console.log("playing");

      document.getElementById("video-overlay").style.display = "none";
    });

    player.addEventListener("vmPausedChange", (event) => {
      console.log("EVENT ", event);
      if (event.detail == true) {
        console.log("EXITING FULLSCREEN");
        player.exitFullscreen();
      }
      document.getElementById("video-overlay").style.display = "block";
    });

    // }

    document.addEventListener("fullscreenchange", (event) => {
      console.log("fullscreen change", event);
      // document.fullscreenElement will point to the element that
      // is in fullscreen mode if there is one. If there isn't one,
      // the value of the property is null.
      if (document.fullscreenElement) {
        isFullscreen = true;
        document.getElementById("video-overlay").style.display = "none";
        console.log(
          `Element: ${document.fullscreenElement} entered full-screen mode.`
        );
      } else {
        console.log("Leaving full-screen mode.");
        document.getElementById("video-overlay").style.display = "block";
        isFullscreen = false;
        player.pause();
      }
    });
    document.addEventListener("webkitfullscreenchange", function(event) {
      console.log("webkit fullscreen change", event);
      // The event object doesn't carry information about the fullscreen state of the browser,
      // but it is possible to retrieve it through the fullscreen API
      if (document.fullscreenElement) {
        isFullscreen = true;
        document.getElementById("video-overlay").style.display = "none";
        console.log("ENTER FULLSCREEN");
      } else {
        document.getElementById("video-overlay").style.display = "block";
        isFullscreen = false;
        console.log("EXITING FULLSCREEN");
        player.pause();
      }
    });
  });
  function playVideo() {
    // player.enterFullscreen();
    player.play();
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
      Issi: {player ? player.playing : null}
    </button>
  </div>
</div>
<div
  id="container"
  class="z-50 w-full h-screen max-w-full min-w-full min-h-full"
>
  <vm-player class="h-screen">
    <vm-vimeo video-id="548283844" class="h-screen" cross-origin="true" />
    <!--  -->

    <vm-default-ui>
      <vm-click-to-play />
      <!-- We setup the default controls and pass in any options.  -->
      <vm-default-controls />
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
