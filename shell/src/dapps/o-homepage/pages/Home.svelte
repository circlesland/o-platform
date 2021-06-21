<script lang="ts">
  import "../../../shared/css/base.css";
  import "../../../shared/css/components.css";
  import "../../../shared/css/utilities.css";

  import Header from "../components/Header.svelte";
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

<div class="flex flex-col ">
  <Header />
  <main class="flex-1 mt-12 overflow-y-auto md:mt-20">
    <VideoHeader />
    <div class="flex flex-wrap md:flex-nowrap">
      <div class="w-full">
        <!-- <IntroAnimation /> -->
        <Mission />
        <Steps />
        <!-- <Dreams /> -->
        <!-- <Citizens />
        <Countries />
        <Milestones /> -->
      </div>
      <!-- <div class="md:w-1/4">
        <Aside />
      </div> -->
    </div>
    <Footer />
  </main>
  <!--<Progress />-->
</div>
