<script lang="ts">
  import Navigation from "../components/Navigation.svelte";
  import VideoHeader from "../components/VideoHeader.svelte";
  import Mission from "../components/Mission.svelte";
  import Steps from "../components/Steps.svelte";
  import Milestones from "../components/Milestones.svelte";
  import Countries from "../components/Countries.svelte";
  import Citizens from "../components/Citizens.svelte";
  import Progress from "../components/Progress.svelte";
  import Aside from "../components/Aside.svelte";
  import Footer from "../components/Footer.svelte";
  import IntroAnimation from "../components/IntroAnimation.svelte";
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@vime/core@^5/themes/default.css"
/>

<!-- 
<div class="flex flex-col h-screen text-base bg-white bg-gradient-to-r">
  <main class="z-30 flex-1 overflow-y-visible">
    <Navigation />
    <div class="flex flex-col text-center justify-items-center pt-11">
      <h1 class="m-auto font-bold font-circles text-gradient w-42">
        You got us!
      </h1>
    </div>
  </main>
  <footer class="sticky bottom-0 z-50 w-full h-30 bg-secondary">
    <div class="container flex justify-around w-full">
      <div class="">left</div>
      <button on:click={login} class="px-8 m-2 btn btn-primary">
        Join us now
      </button>
      <div class="">right</div>
    </div>
  </footer>
</div> -->

<div class="flex flex-col h-screen">
  <Navigation />
  <main class="flex-1 overflow-y-auto">
    <VideoHeader />
    <div class="flex flex-wrap md:flex-nowrap">
      <div class="md:w-3/4">
        <IntroAnimation />
        <Steps />
        <Mission />
        <!-- <Dreams /> -->
        <Citizens />
        <Countries />
        <Milestones />
      </div>
      <div class="md:w-1/4">
        <Aside />
      </div>
    </div>
    <Progress />
    <Footer />
  </main>
</div>
