<script lang="ts">
  // import Icons from "../../../shared/molecules/Icons.svelte";
  export let imageUrl:string;
  export let title:string;
  export let text:string;
</script>

<section
  class="flex items-center justify-center mb-2 "
  on:click
>
  <div
    class="flex items-center w-full px-4 pt-4 space-x-2 bg-white rounded-sm shadow sm:space-x-6"
  >
    <div class="mr-2 -mt-3 text-center">
      <div class="avatar">
        <div class="w-12 h-12 m-auto rounded-full sm:w-12 sm:h-12">
          <img src={imageUrl} alt={title} />
        </div>
      </div>
    </div>

    <div class="relative flex-grow text-left truncate">
      <div class="max-w-full cursor-pointer truncateThis">
        <h2 class="text-base">
          {title}
        </h2>
      </div>

      {#if text}
        <div class="mb-4 text-xs text-left text-alert-dark">
          <span class="inline ">{text}</span>
        </div>
      {/if}
    </div>

    <div class="flex flex-col self-start flex-1 mt-2 justify-items-end">
      <div class="flex flex-col self-end space-y-2 text-2xl sm:text-3xl ">
        <!--
        <button
          on:click={(e) => {
            execTransfer(safeAddress);
            e.stopPropagation();
            return false;
          }}
          class="self-end text-base "
        >
          <Icons icon="sendmoney" />
        </button>
        -->
      </div>
    </div>
  </div>
</section>
