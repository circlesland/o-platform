<script lang="ts">
import { onMount } from "svelte";
import {
  GetAllStringsByMaxVersionAndLangDocument,
  GetAllStringsByMaxVersionAndLangQuery,
  GetAllStringsByMaxVersionDocument,
  GetAllStringsByMaxVersionQuery,
  GetStringByLanguageQuery,
  I18n,
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";
import Tree from "../atoms/Tree.svelte";
import { CTreeNode } from "../classes/treenode";
import { createEventDispatcher } from "svelte";
import { Environment } from "../../../shared/environment";

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

<section class="text-white p-6">
  <form
    class="flex grow justify-center"
    on:submit|preventDefault="{() => {
      dispatch('keySearch', { keyFilter: keyFilter, i18nData: displayedI18nData });
      keyFilter = '';
    }}">
    <input bind:value="{keyFilter}" class="input rounded-r-none" type="text" placeholder="dapps.o-banking..." />
    {#if keyFilter == ""}
      <button class="btn-primary btn-disabled btn-md rounded-btn rounded-l-none bg-gray-400 text-white">
        search
      </button>
    {:else}
      <button class="btn-primary btn-md rounded-btn rounded-l-none">search</button>
    {/if}
  </form>

  <div class="mr-3 ml-3 mt-3">
    <Tree rootNode="{displayedTree}" language="{language}" on:showStrings />
  </div>
</section>
