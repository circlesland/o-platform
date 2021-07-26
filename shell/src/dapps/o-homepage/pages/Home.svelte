<script lang="ts">
  import "../../../shared/css/tailwind.css";
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import VideoHeader from "../components/VideoHeader.svelte";
  import { onMount } from "svelte";
  import {interpret} from "xstate";
  import {initMachine} from "../../o-onboarding/processes/init";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;


  onMount(() => {
    const initService = interpret(initMachine)
            .onEvent(event => console.log(event))
            .onTransition((state) => console.log(state.value));

    setTimeout(() => {
      initService.start();
    }, 2000);
/*
    setTimeout(() => {
      initService.send(<any>{type: "GOT_INVITED", invitation: {}})
    }, 6000);
*/

  });


</script>

<div class="flex flex-col overflow-hidden ">

  <main class="h-screen overflow-hidden">
    <TopNav {runtimeDapp} {routable} />
    <div class="mt-11">
      <VideoHeader />
    </div>
  </main>
  <!--<Progress />-->
</div>
