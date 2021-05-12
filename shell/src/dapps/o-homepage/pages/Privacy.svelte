<script lang="ts">
  import Progress from "../components/Progress.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<div
  class="flex flex-col h-screen  bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  <main class="flex-1 overflow-y-visible z-30">
    <div class="flex flex-col text-center justify-items-center pt-11">
      <h1 class="font-circles font-bold">You got us!</h1>
      <h2 class="font-circles font-thin pt-11">
        We're currently actively working on this.<br />All Data will be re-set
        when we launch.
      </h2>
    </div>
    <Progress />
    <Footer />
  </main>
</div>
