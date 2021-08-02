<script lang="ts">
  import { me } from "../../../shared/stores/me";
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import PageHeader from "src/shared/atoms/PageHeader.svelte";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  $: me;

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let avatarUrl: string = "";
  $: {
    if ($me && $me.avatarUrl) {
      avatarUrl = $me.avatarUrl;
    } else if ($me) {
      avatarUrl = AvataarGenerator.generate($me.circlesAddress);
    } else {
      avatarUrl = AvataarGenerator.default();
    }
  }
</script>

<TopNav {runtimeDapp} {routable} />

<PageHeader heightClass="h-28">

  <div class="self-center flex-grow text-center justify-self-start">
    <div class="text-xl">
      <h1 class="text-4xl text-white font-heading">
        Welcome {$me ? $me.firstName : ''}
      </h1>
    </div>
  </div>
</PageHeader>
