<script lang="ts">
  import "../../../shared/css/tailwind.css";
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import VideoHeader from "../components/VideoHeader.svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
  export let inviteCode: any;

  if (inviteCode) {
    localStorage.setItem("circlesInvite", inviteCode);
    window.runInitMachine();
  }
</script>

<div class="flex flex-col overflow-hidden ">
  <main className="h-screen overflow-hidden">
    <TopNav {runtimeDapp} {routable}/>
    <div className="mt-11">
      <VideoHeader/>
    </div>
  </main>
  <!--<Progress />-->
</div>
