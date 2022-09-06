<script lang="ts">
import { isMobile } from "src/shared/functions/isMobile";
import {_} from "svelte-i18n";
import Label from "../atoms/Label.svelte";
</script>

{#if isMobile()}
  <div class="z-10 flex flex-col flex-1 text-white bg-dark">
    <nav class="flex flex-col flex-1 w-1 p-4 mt-4"></nav>
    <div class="flex-shrink-0 p-4 space-y-4">
      <a href="#" class="flex items-center space-x-2">
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2
                    2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0
                    011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
        <span><Label key="shared.molecules.filterList.home"  /></span>
      </a>
      <button class="flex items-center space-x-2">
        <svg
          aria-hidden="true"
          class="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0
                    01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
        </svg>
        <span><Label key="shared.molecules.filterList.logout"  /></span>
      </button>
    </div>
  </div>
{:else}
  <div class="relative flex-shrink-0 w-64 p-4 pt-16 space-y-4">
    <a href="#" class="flex items-center space-x-2">
      <svg
        class="w-6 h-6"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1
            0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0
            001 1m-6 0h6"></path>
      </svg>
      <span><Label key="shared.molecules.filterList.home"  /></span>
    </a>

    <button class="flex items-center space-x-2">
      <svg
        aria-hidden="true"
        class="w-6 h-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3
            0 013-3h4a3 3 0 013 3v1"></path>
      </svg>
      <span><Label key="shared.molecules.filterList.logout"  /></span>
    </button>
  </div>
{/if}
