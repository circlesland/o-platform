<script lang="ts">
  import { onMount } from "svelte";
  import UAParser from "ua-parser-js";
  import Icons from "src/shared/molecules/Icons.svelte";
  import Label from "../../../shared/atoms/Label.svelte";

  let parser = new UAParser();
  let player: any;
  let isFullscreen: boolean = false;
  let isMobile: boolean = parser.getResult().device["type"] == "mobile";
  $: player = document.querySelector("vm-player");

  onMount(() => {
    window.player = document.querySelector("vm-player");
    player = document.querySelector("vm-player");

    player.addEventListener("vmPlay", event => {
      document.getElementById("video-overlay").style.display = "none";
    });

    player.addEventListener("vmPausedChange", event => {
      if (event.detail == true) {
        player.exitFullscreen();
      }
      document.getElementById("video-overlay").style.display = "block";
    });

    document.addEventListener("fullscreenchange", event => {
      // document.fullscreenElement will point to the element that
      // is in fullscreen mode if there is one. If there isn't one,
      // the value of the property is null.
      if (document.fullscreenElement) {
        isFullscreen = true;
        document.getElementById("video-overlay").style.display = "none";
      } else {
        document.getElementById("video-overlay").style.display = "block";
        isFullscreen = false;
        player.pause();
      }
    });
    document.addEventListener("webkitfullscreenchange", function(event) {
      // The event object doesn't carry information about the fullscreen state of the browser,
      // but it is possible to retrieve it through the fullscreen API
      if (document.fullscreenElement) {
        isFullscreen = true;
        document.getElementById("video-overlay").style.display = "none";
      } else {
        document.getElementById("video-overlay").style.display = "block";
        isFullscreen = false;

        player.pause();
      }
    });
  });

  function playVideo() {
    player.enterFullscreen();
    // This is weird, but safari won't play if it at the same time toggles into fullscreen mode.
    setTimeout(function() {
      player.play();
    }, 300);
  }
</script>

<div
  id="video-overlay"
  class="relative flex items-center content-center justify-center h-screen overflow-hidden"
  style=" background-position: center; background:
  url('/images/homepage/circles-home.jpg') no-repeat center center fixed;
  -webkit-background-size: cover; -moz-background-size: cover;
  -o-background-size: cover; background-size: cover; ">
  <div
    class="absolute z-30 flex flex-col items-stretch content-center w-full h-full min-h-full pb-40 text-center video-overlay"
    on:click="{() => playVideo()}">
    <h1 class="px-5 text-4xl text-white font-heading md:text-6xl mt-11">
      <Label key="dapps.o-homepage.components.videoHeader.beFree"  />
    </h1>
    <h2 class="flex-grow px-5 pt-4 text-xl font-thin text-white sm:text-3xl ">
      <Label key="dapps.o-homepage.components.videoHeader.togetherWeBuild"  />
    </h2>
    <button class="flex-grow" on:click="{() => playVideo()}">
      <div class="inline-flex mt-2">
        <Icons icon="playbutton" />
      </div>
      <div class="pt-0 text-lg text-center text-white sm:pt-2"><Label key="dapps.o-homepage.components.videoHeader.playVideo"  /></div>
    </button>
  </div>
</div>
<div
  id="container"
  class="z-50 w-full h-screen max-w-full min-w-full min-h-full">
  <vm-player class="h-screen">
    <vm-vimeo
      video-id="548283844"
      class="h-screen"
      cross-origin="true"></vm-vimeo>
    <!--  -->

    <vm-default-ui>
      <vm-click-to-play></vm-click-to-play>
      <!-- We setup the default controls and pass in any options.  -->
      <vm-default-controls></vm-default-controls>
    </vm-default-ui>
  </vm-player>
</div>

<style>
  #container {
    width: 100%;
    max-width: 960px;
  }
</style>
