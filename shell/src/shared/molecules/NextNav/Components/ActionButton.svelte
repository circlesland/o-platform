<script lang="ts">
import Icons from "../../Icons.svelte";

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
    <img src="/logos/circles.png" alt="circlesLand" class="bg-white rounded-full navlogo" />
  {:else if $me}
    <div class="navlogo">
      <div class="text-center align-top list-none cursor-pointer inline-table">
        <span>
          <span class="table-cell align-middle bg-white rounded-full h-14">
            <div
              class="self-center text-center rounded-full justify-self-center rounded-corners-lightgray-borders"
              style="padding: 1px;">
              <div class="pt-2 pl-1 m-auto bg-white rounded-full w-14 h-14 text-lightgrey">
                <Icons icon="user" customClass="inline w-10 h-10 heroicon " solid="{true}" />
              </div>
            </div>
          </span>
        </span>
      </div>
    </div>
  {:else}
    <img src="/logos/actionbutton.svg" alt="circlesLand" class="bg-white rounded-full navlogo" />
  {/if}
</div>
<!-- <div class="has-tooltip">
        <div
          class="self-center text-center rounded-full justify-self-center ounded-corners-gradient-borders"
          style="padding: 1px">
          <div class="relative m-auto bg-white rounded-full w-15 h-15">
            <Icons icon="plus" />
          </div>
        </div>
      </div> -->
