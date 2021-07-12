<script lang="ts">
  import { me } from "../../../shared/stores/me";
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import PageHeader from "src/shared/atoms/PageHeader.svelte";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  $: me;

  export let runtimeDapp:RuntimeDapp<any>;
  export let routable:Routable;

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

<PageHeader
  heightClass="h-72"
  headerBackground="/images/common/headerbackground/header-background-passport.jpg"
>
  <div class="self-center mt-4 text-center avatar justify-self-center">
    <div class="mb-4 rounded-full w-36 h-36">
      <img
        src={avatarUrl}
        alt={$me
          ? $me.lastName
            ? `${$me.firstName} ${$me.lastName}`
            : $me.firstName
          : "avatar"}
      />
    </div>
  </div>
  <div class="self-center flex-grow text-center justify-self-start">
    <div class="text-xl">
      <strong>Welcome {$me ? $me.firstName : ""}</strong>
    </div>
  </div>
</PageHeader>
