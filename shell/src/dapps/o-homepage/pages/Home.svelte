<script lang="ts">
  import "../../../shared/css/tailwind.css";
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import VideoHeader from "../components/VideoHeader.svelte";
  import { onMount } from "svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  // TODO: GRAB MODAL CLOSE AND HIDE OVERFLOW
  onMount(() => {
    document.body.style.overflow = "hidden";
  });
</script>

<div class="overflow-hidden flex flex-col ">

  <main class="overflow-hidden h-screen">
    <TopNav {runtimeDapp} {routable} />
    <div class="mt-11">
      <VideoHeader />
    </div>
  </main>
  <!--<Progress />-->
</div>
