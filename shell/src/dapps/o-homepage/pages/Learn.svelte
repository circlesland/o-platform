<script lang="ts">
  import { identify } from "../../o-passport/processes/identify/identify";
  import { me } from "../../../shared/stores/me";

  $: {
    console.log($me); // TODO: This is just to init the store. There could be a better solution to do this :)
  }

  $: me;

  function login() {
    window.o.runProcess(identify, { redirectTo: "/dashboard" });
  }
</script>

<div class="flex flex-col h-screen text-white bg-primary-dark">
  <main class="z-30 flex-1 overflow-y-visible">
    <div class="flex flex-col text-center justify-items-center pt-11">
      <h1 class="font-bold ">You got us!</h1>
      <h2 class="font-thin  pt-11">
        We're currently actively working on this.<br />All Data will be re-set
        when we launch.
      </h2>
    </div>
  </main>
  <footer class="sticky bottom-0 z-50 w-full ">
    <div class="flex justify-around ">
      <button on:click={login} class="mb-4 btn btn-white">
        <img
          width="15px"
          class="mr-3"
          src="/images/common/circles.png"
          alt="circles.land"
        /> Login
      </button>
    </div>
  </footer>
</div>
