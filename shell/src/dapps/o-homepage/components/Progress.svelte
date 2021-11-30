<script lang="ts">
import { identify } from "../../o-passport/processes/identify/identify2";
import { me } from "../../../shared/stores/me";
import { onMount } from "svelte";
import { location } from "svelte-spa-router";

$: {
  console.log($me); // TODO: This is just to init the store. There could be a better solution to do this :)
}

$: me;

onMount(() => {
  if ($location === "/login") {
    login();
  }
});

async function login() {
  window.o.runProcess(identify, { redirectTo: "/home" });
}
</script>

<div
  class="sticky bottom-0 z-50 w-full pt-1 bg-white border-t progressnav border-base-300">
  <!-- <div class="flex flex-row items-stretch w-full bg-white">
    <div class="m-auto tracking-wider ">
      <span class="relative top-2">2489 CITIZENS</span>
    </div>
  </div>
  <div class="flex flex-row items-stretch w-full h-10 mb-6 bg-white">
    <div
      class="relative flex-grow h-2 mt-8 border-b-2 border-r-2 w-42 border-secondary"
    >
      <span class="absolute tracking-wider -right-4 bottom-2 "
        >GOAL 12</span
      >
    </div>
    <div class="flex-grow h-2 mt-8 border-b-2 w-42 border-secondary" />
    <div class="flex-grow h-2 mt-8 border-b-2 w-42 border-light">
      <span class="relative w-2 h-2 dot right-1" />
    </div>
    <div
      class="relative flex-grow h-2 mt-8 border-b-2 border-l-2 w-42 border-light"
    >
      <span class="absolute tracking-wider text-light bottom-2 -left-4">
        GOAL 13</span
      >
    </div>
  </div> -->

  <!-- <div class="flex items-center justify-between mb-2">
    <div>
      <span
        class="inline-block px-2 py-1 text-lg font-semibold text-gray-500 uppercase "
      >
        Goal 6
      </span>
    </div>
    <div class="text-right">
      <span class="inline-block px-2 py-1 text-lg font-semibold text-gray-500">
        300 of 453 citizens
      </span>
    </div>
  </div> -->
  <button
    on:click="{login}"
    class="absolute transition-none shadow-md joinnowbutton btn btn-primary bottom-3 left-1/2">
    <svg
      class="inline w-6 h-6 mr-3"
      viewBox="0 0 229 255"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M118.5 237C150.437 237 179.424 224.366 200.734 203.822C209.904 197.627 215.933 187.136 215.933 175.236C215.933 156.198 200.499 140.764 181.461 140.764C170.572 140.764 160.863 145.812 154.545 153.695L154.457 153.627C145.313 163.112 132.476 169.012 118.261 169.012C90.4957 169.012 67.9879 146.504 67.9879 118.739C67.9879 90.9745 90.4957 68.4667 118.261 68.4667C132.339 68.4667 145.067 74.254 154.193 83.5795L154.29 83.5037C160.581 90.2293 169.535 94.4328 179.471 94.4328C198.51 94.4328 213.944 78.9988 213.944 59.9601C213.944 48.1884 208.043 37.7949 199.039 31.5755C177.899 11.9794 149.599 0 118.5 0C53.0543 0 0 53.0543 0 118.5C0 183.946 53.0543 237 118.5 237Z"
        fill="white"></path>
      <ellipse cx="118.979" cy="118.739" rx="26.5727" ry="26.3333" fill="white"
      ></ellipse>
    </svg> Join Now
  </button>
  <div class="flex overflow-hidden text-xs bg-gray-300 h-11">
    <div
      style="width:100%"
      class="flex flex-col justify-center text-center text-white shadow-none whitespace-nowrap bg-primary-dark">
    </div>
  </div>
</div>

<style>
.progressnav {
  -webkit-backface-visibility: hidden;
  position: -webkit-sticky;
}
.joinnowbutton {
  transform: translate(-50%, 0) !important;
  animation: none !important;
}
.joinnowbutton:active:focus,
.joinnowbutton:active:hover {
  transform: translate(-50%, 0);
  animation: none !important;
}

/* .dot {
    @apply bg-secondary;
    bottom: 7px;
    border-radius: 50%;
    display: inline-block; */
/* box-shadow: 0 0 15px #003399; */
/* border: 5px solid hsl(220 100% 29%); */

/* #2 */
/* padding: 5px; */
/* background: hsl(0, 0%, 20%); */

/* #3 */
/* outline: 5px solid hsl(220 100% 29%); */

/* #4 AND INFINITY!!! (CSS3 only) */
/* box-shadow: 0 0 0 10px hsl(229, 61%, 53%), 0 0 0 15px hsl(241, 93%, 27%); */
/* } */
/* .dot:after {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: inset 10px 24px 40px 0px #003399,
      inset -10px -24px 40px 0px #003399, inset 20px -10px 40px 0px #003399,
      inset -20px 10px 40px 0px #003399;
  } */
</style>
