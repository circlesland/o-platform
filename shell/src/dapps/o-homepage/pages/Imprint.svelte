<script lang="ts">
  import Header from "../components/Header.svelte";
  import Progress from "../components/Progress.svelte";
  import Footer from "../components/Footer.svelte";
  import { _ } from "svelte-i18n";
import { dapps } from "../../../loader";
</script>

<div class="flex flex-col h-screen text-white bg-primary-dark">
  <Header />
  <main class="z-30 flex-1 overflow-y-visible">
    <div class="flex flex-col text-center justify-items-center pt-11">
      <h1 class="font-bold ">{$_("dapps.o-homepage.pages.imprint.imprint")}</h1>
    </div>
    <Progress />
    <Footer />
  </main>
</div>
