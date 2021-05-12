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
