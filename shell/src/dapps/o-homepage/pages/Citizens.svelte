<script lang="ts">
  import Dreams from "../components/Dreams.svelte";
  import Header from "../components/Header.svelte";
  import Progress from "../components/Progress.svelte";
  import Footer from "../components/Footer.svelte";
</script>

<div class="flex flex-col h-screen">
  <Header />
  <main class="z-30 flex-1 overflow-y-visible">
    <Dreams />
    <Progress />
    <Footer />
  </main>
</div>
