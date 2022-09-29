<script lang="ts">
import { onMount } from "svelte";
import {
  I18n,
} from "../../../shared/api/data/types";
import Tree from "../atoms/Tree.svelte";
import { CTreeNode } from "../classes/treenode";
import { createEventDispatcher } from "svelte";
import Icon from "@krowten/svelte-heroicons/Icon.svelte";

let keyFilter: string = "";

let displayedI18nData: I18n[] = [];

let dispatch = createEventDispatcher();

export let searchString: string = "";
export let language: string;
export let fullI18nData: I18n[] = [];
export let displayedTree: CTreeNode = new CTreeNode("root");

onMount(async () => {
  displayedTree.restoreStateSnapshot({ root: true });
});

$: {
  searchString;
  language;
  fullI18nData;
  displayedTree;
}
</script>

<section class="text-white p-6 flex-col">
  <form
    class="flex justify-center w-[100%] items-stretch"
    on:submit|preventDefault="{() => {
      dispatch('keySearch', { keyFilter: keyFilter, i18nData: displayedI18nData });
      keyFilter = '';
    }}">
    <input bind:value="{keyFilter}" class="rounded-r-none w-[75%]" type="text" placeholder="dapps.o-banking..." />
    {#if keyFilter == ""}
      <button class="btn-primary btn-disabled btn-sm rounded-btn rounded-l-none bg-gray-400 text-white">
        <Icon name="search" class="h-5 w-5 text-white" solid />
      </button> 
    {:else}
      <button class="btn-primary btn-sm rounded-btn rounded-l-none">
        <Icon name="search" class="h-5 w-5 text-white" solid />
      </button>
    {/if}
  </form>

  <div class="mr-3 ml-3 mt-3">
    <Tree
      rootNode="{displayedTree}"
      language="{language}"
      on:showStrings
      on:getStringsToUpdate />
  </div>
</section>
