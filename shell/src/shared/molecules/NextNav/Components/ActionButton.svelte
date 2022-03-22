<script lang="ts">
import { createEventDispatcher } from "svelte";
import UserImage from "../../../atoms/UserImage.svelte";
import { me } from "../../../stores/me";
import Icons from "../../Icons.svelte";

export let icon: string;

const dispatcher = createEventDispatcher();
</script>

<div on:click="{() => dispatcher('actionButton')}">
  {#if icon == "close"}
    <Icons icon="close" />
    <!-- <img
      src="/logos/close.svg"
      alt="circlesLand"
      class="bg-white rounded-full navlogo" /> -->
  {:else if icon == "logo"}
    <img
      src="/logos/circles.png"
      alt="circlesLand"
      class="bg-white rounded-full navlogo" />
  {:else if $me}
    <div class="navlogo">
      <UserImage
        profile="{$me}"
        size="{15}"
        gradientRing="{true}"
        profileLink="{false}" />
    </div>
  {:else}
    <img
      src="/logos/actionbutton.svg"
      alt="circlesLand"
      class="bg-white rounded-full navlogo" />
  {/if}
</div>
