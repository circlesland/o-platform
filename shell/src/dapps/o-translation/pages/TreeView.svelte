<script lang="ts">
import { onMount } from "svelte";
import {
  GetAllStringsByMaxVersionDocument,
  GetAllStringsByMaxVersionQuery,
  I18n,
} from "../../../shared/api/data/types";
import { ApiClient } from "../../../shared/apiConnection";
import Tree from "../atoms/Tree.svelte";

let i18nData: I18n[] = [];
let tree: object = {};
let currentNode = tree;

let expanded: boolean = false;

function toggle() {
  expanded = !expanded;
}

async function createTree() {
  i18nData = await getI18nData();
  for (const row of i18nData) {
    resetCurrentNode();
    let keyParts = row.key.split(".");
    for (let i = 0; i < keyParts.length; i++) {
      let keyPart = keyParts[i];
      if (containsBranch(keyPart)) {
        currentNode = currentNode[keyPart];
      } else {
        if (isLastKey(i, keyParts)) {
          if (alreadyContainsLeaf(currentNode, keyPart)) {
            appendRowToLeaf(currentNode, keyPart, row);
          } else {
            createNewLeaf(currentNode, keyPart, row);
          }
        } else {
          currentNode[keyPart] = {};
        }
        currentNode = currentNode[keyPart];
      }
    }
  }
  tree = tree;
  console.log(tree);
}

onMount(async () => {
  await createTree();
  //buildHtmlTree(tree);
  htmlTree = htmlTree;
  svelteTree = Object.keys(tree);
});

function containsBranch(keyPart: string) {
  return currentNode[keyPart] && !Array.isArray(currentNode[keyPart]);
}

function resetCurrentNode() {
  currentNode = tree;
}

async function getI18nData() {
  return await ApiClient.query<I18n[], GetAllStringsByMaxVersionQuery>(GetAllStringsByMaxVersionDocument, {});
}

function isLastKey(i: number, keyParts: string[]) {
  return i == keyParts.length - 1;
}

function createNewLeaf(currentNode: {}, keyPart: string, row: I18n) {
  currentNode[keyPart] = [row];
}

function appendRowToLeaf(currentNode: {}, keyPart: string, row: I18n) {
  currentNode[keyPart].push(row);
}

function alreadyContainsLeaf(currentNode: {}, keyPart: string) {
  return currentNode[keyPart];
}

//function buildHtmlTree(treeNode: object) {
//  let objKeys = Object.keys(treeNode);
//  if (objKeys.length == 0) {
//    return;
//  }
//  for (let key of objKeys) {
//    let currentNode = treeNode[key];
//    htmlTree += `
//      <ul class="ml-2 mb-4">
//        <span>
//          ${key}
//        </span>
//      `;
//    if (Array.isArray(currentNode)) {
//      // is leaf
//      for (let currentLanguage of currentNode) {
//        htmlTree += `
//          <li class="ml-2">
//            ${currentLanguage.lang}: ${currentLanguage.value}
//          </li>
//          `;
//      }
//    } else {
//      // is branch
//      buildHtmlTree(treeNode);
//    }
//    htmlTree += `</ul>`;
//  }
//}

let htmlTree: string = "";
let currentSvelteNode: object = {};
let svelteTree = Object.keys(tree);

</script>

<section>
  <Tree data="{tree}" />
</section>
