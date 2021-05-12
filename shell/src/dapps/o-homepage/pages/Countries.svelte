<script lang="ts">
  import Countries from "../components/Countries.svelte";
  import Progress from "../components/Progress.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<div class="flex flex-col h-full">
  <main class="z-30 flex-1 overflow-y-visible">
    <Countries />
    <Progress />
    <Footer />
  </main>
</div>
