<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import TreeNav from "./TreeNav.svelte";
import EditorView from "./EditorView.svelte";


export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

const listArguments = {};
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<section class="flex flex-row items-center justify-center p-6">
  <div style="background-color: aquamarine;">
    <TreeNav />
  </div>
  <div class="w-2/3" style="background-color: blue;">
    <EditorView />
  </div>
</section>
