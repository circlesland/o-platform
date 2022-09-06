<script lang="ts">
import Icon from "@krowten/svelte-heroicons/Icon.svelte";
import { push } from "svelte-spa-router";
import Label from "../../../shared/atoms/Label.svelte";

export let color: string;
export let link: string;
export let blobshape: string;
export let icon: string;
export let title: string;

function loadLink(alink, external = false) {
  if (external) {
    window.open(alink, "_blank").focus();
  } else {
    push(alink);
  }
}
</script>

<section
  class="relative items-center justify-center h-48 overflow-hidden rounded-lg shadow-md cursor-pointer bg-{color} dashboard-card"
  on:click="{() => loadLink(link)}">
  <div class="blob bg-{color}-light" style="border-radius: {blobshape}">
    <div class="pt-2 text-white">
      <!-- <Icons icon="dashpassport" /> -->
      <Icon name="{icon}" class="relative w-20 h-20 left-32 heroicon top-10" solid="{true}" />
    </div>
  </div>
  <div class="absolute left-6 bottom-4">
    <div class="text-3xl text-white font-heading">
      <Label key="{title}" />
    </div>
  </div>
</section>

<style>
.blob {
  position: absolute;
  right: -30px;
  top: -30px;
  width: 350px;
  height: 150px;
}
</style>
