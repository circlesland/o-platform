<script lang="ts">
import "../../../shared/css/tailwind.css";
import TopNav from "../../../shared/atoms/TopNav.svelte";
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
  <main class="h-screen overflow-hidden">
    <TopNav runtimeDapp="{runtimeDapp}" routable="{routable}" />

    <VideoHeader />
  </main>
</div>
