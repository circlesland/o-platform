<script lang="ts">
  import { me } from "../../../shared/stores/me";
  import TopNav from "src/shared/atoms/TopNav.svelte";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";

  $: me;

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

<TopNav />

<div
  class="flex flex-col items-stretch w-full text-white bg-cover h-60 justify-items-stretch bg-primarydark"
  style="background-image: url(/images/common/nice-bg.jpg);"
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
</div>
