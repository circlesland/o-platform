<script lang="ts">
  import { onMount } from "svelte";
  export let data: {
    error: Error;
  };

  let error: any;

  $: {
    console.error(
      `An error occurred during the execution of a workflow:`,
      data
    );
    if (data && data.error) {
      console.error(data.error);
      error = data.error;
    } else {
      console.error(window.o.lastError);
      error = window.o.lastError;
    }
  }

  var autoExpand = function () {
    var el = this;
    setTimeout(function () {
      el.style.cssText = "height:auto; padding:0 padding-top: 2px;";
      el.style.cssText = "height:" + el.scrollHeight + "px";
    }, 0);
  };

  onMount(() => {
    let textarea = document.querySelector("textarea");
    textarea.addEventListener("input", autoExpand);
    textarea.dispatchEvent(new Event("input"));
  });
</script>

<div class="bg-white rounded-lg p-5 w-full">
  <div class="alert alert-error mb-2 mt-2">
    <div class="flex-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="w-12 h-12 mx-2 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
        />
      </svg>
      <label for="input" class="break-all"
        ><h4><strong>The process encountered an error</strong></h4>
        {#if error && error.message}
          {error.message}
        {/if}
      </label>
    </div>
  </div>
  {#if error}
    <textarea
      name="input"
      rows="1"
      id="errormessage"
      type="text"
      value={error.stack}
      class="errormessage textarea  textarea-bordered overflow-y-scroll input-error w-full mt-5 mb-5 max-h-72"
    />
  {:else}
    No error details available. See the console for more details.
  {/if}
  <a href="https://discord.gg/SACzRXa35v">
    Please try to reload the page or contact us on Discord <a
      href="https://discord.gg/4DBbRCMnFZ"
      target="_blank"
      class="btn-link">https://discord.gg/4DBbRCMnFZ</a
    > if the problem persists.
  </a>
</div>

<style>
  textarea.errormessage {
    font-size: 0.8rem;
    line-height: 1.2rem;
  }
</style>
