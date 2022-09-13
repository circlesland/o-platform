<script lang="ts">
import { me } from "../stores/me";
import Icons from "./Icons.svelte";
import { createEventDispatcher } from "svelte";
import { Environment } from "../environment";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";

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
  </div>
{/if}
