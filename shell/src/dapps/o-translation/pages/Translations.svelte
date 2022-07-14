<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";

import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
import TreeView from "./TreeView.svelte";
import EditorView from "./EditorView.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<section class="p-6 inline-grid grid-cols-4 w-full">
  <div class="h-full bg-blue-900 col-span-1">
    <TreeView />
  </div>
  <div class="col-span-3">
    <EditorView />
  </div>
</section>
