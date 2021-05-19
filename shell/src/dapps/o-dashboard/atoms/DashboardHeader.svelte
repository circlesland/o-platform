<script lang="ts">
  import { me } from "../../../shared/stores/me";
  import TopNav from "src/shared/atoms/TopNav.svelte";

  $: me;
</script>

<TopNav showHomeButton={false} showWebsiteButton={true} />

<div
  class="h-60 flex flex-col w-full items-stretch justify-items-stretch  bg-gradient-to-r from-gradient1 to-gradient2 text-white"
>
  <div class="avatar self-center justify-self-center text-center">
    <div class="w-36 h-36 rounded-full mb-4">
      <img
        src={$me && $me.avatarUrl ? $me.avatarUrl : ""}
        alt={$me
          ? $me.lastName
            ? `${$me.firstName} ${$me.lastName}`
            : $me.firstName
          : "avatar"}
      />
    </div>
  </div>
  <div class="self-center flex-grow justify-self-start text-center">
    <div class="text-xl">
      <strong>Welcome {$me ? $me.firstName : ""}</strong>
    </div>
  </div>
</div>
