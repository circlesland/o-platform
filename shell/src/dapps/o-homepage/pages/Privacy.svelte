<script lang="ts">
  import Header from "../components/Header.svelte";
  import Progress from "../components/Progress.svelte";
  import Footer from "../components/Footer.svelte";
  import {_} from "svelte-i18n";
  import Label from "../../../shared/atoms/Label.svelte";
</script>

<div class="flex flex-col h-screen text-white bg-primary-dark">
  <Header />
  <main class="z-30 flex-1 overflow-y-visible">
    <div class="flex flex-col text-center justify-items-center pt-11">
      <h1 class="font-bold "><Label key="dapps.o-homepage.pages.privacy.youGotUs" /></h1>
      <h2 class="font-thin  pt-11">
        {$_("dapps.o-homepage.pages.privacy.excuse1")}<br />{$_("dapps.o-homepage.pages.privacy.excuse2")}
      </h2>
    </div>
    <Progress />
    <Footer />
  </main>
</div>
