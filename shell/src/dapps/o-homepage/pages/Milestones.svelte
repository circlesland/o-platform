<script lang="ts">
  import Milestones from "../components/Milestones.svelte";
  import Progress from "../components/Progress.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<div class="flex flex-col h-full">
  <main class="z-30 flex-1 overflow-y-visible">
    <Milestones />
    <Progress />
    <Footer />
  </main>
</div>
