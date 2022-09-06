<script lang="ts">
import { me } from "../stores/me";
import Icons from "./Icons.svelte";
import { createEventDispatcher } from "svelte";
import { Environment } from "../environment";

export let actions: {
  icon: string;
  title: string;
  colorClass: string;
  action: () => void;
}[];

let dispatch = createEventDispatcher();

function handleClick(action) {
  if (action.event) {
    window.o.publishEvent(action.event);
  }
  if (action.action) {
    action.action();
  }
}
</script>

{#if actions}
  <div class="flex flex-row flex-wrap items-stretch justify-around mt-2 -mr-2 text-dark">
    {#each actions as action}
      {#if action.key === $me.circlesAddress}
        <div
          class="text-center align-top list-none cursor-pointer inline-table"
          on:click="{() => window.o.publishEvent({ type: 'shell.closeModal' })}">
          <span>
            <span class="inline table-cell w-12 h-12 align-middle rounded-full bg-light-light">
              <div
                class="self-center text-center rounded-full justify-self-center rounded-corners-gradient-borders"
                style="padding: 1px;">
                <div class="w-12 h-12 m-auto bg-white rounded-full">
                  <img class="w-12 h-12 rounded-full" src="{action.icon}" alt="{action.title}" />
                </div>
              </div>
            </span>
            <span class="block w-24 mt-1 text-xs text-center break-normal sm:text-sm ">
              {action.title}
            </span>
          </span>
        </div>
      {:else}
        <div class="text-center align-top list-none cursor-pointer inline-table" on:click="{() => handleClick(action)}">
          <span>
            {#if action.icon.startsWith("http") || action.icon.startsWith("data:")}
              <span class="inline table-cell w-12 h-12 align-middle rounded-full bg-light-light">
                <div class="self-center text-center rounded-full justify-self-center" style="padding: 1px;">
                  <div class="w-12 h-12 m-auto bg-white rounded-full">
                    <img class="w-12 h-12 rounded-full" src="{action.icon}" alt="action" />
                  </div>
                </div>
              </span>
            {:else}
              <span class="table-cell w-12 h-12 align-middle rounded-full bg-light-light">
                <Icons icon="{action.icon}" size="{6}" customClass="inline" />
              </span>
            {/if}
            <span class="block w-24 mt-1 text-xs text-center break-normal sm:text-sm ">
              {action.title}
            </span>
          </span>
        </div>
      {/if}
    {/each}
    {#if Environment.showLanguageSwitcher}
      <div
        class="text-center align-top list-none cursor-pointer inline-table"
        on:click="{() => {
          dispatch('siwtchEvent');
        }}">
        <svg
          class="table-cell w-12 h-12 align-middle rounded-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          fill="grey"
          ><!--! Font Awesome Pro 6.1.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
            d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 
              446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 
              398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 
              490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 
              506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 
              419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 
              22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 
              175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 
              83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 
              1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 
              93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 
              143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 
              175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"></path
          ></svg> 
        <p class="block w-24 text-xs sm:text-sm mt-3 text-center break-normal">Change Language</p>
      </div>
    {/if}
  </div>
{/if}
