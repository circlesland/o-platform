<script lang="ts">
  export let data: {
    error: Error
  };

  let error:any;

  $: {
    console.error(`An error occurred during the execution of a workflow:`, data);
    if (data && data.error)
    {
      console.error(data.error);
      error = data.error;
    } else {
      console.error(window.o.lastError);
      error = window.o.lastError;
    }
  }
</script>

<div class="bg-danger p-5 overflow-y-scroll max-w-full" style="max-height: 24em">
  <span class="text-primary text-2xl">The process encountered an error:</span><br/>
  <a href="https://discord.gg/SACzRXa35v">
    Please try to reload the page or contact us on Discord <u>https://discord.gg/SACzRXa35v</u> if the problem persists.
  </a><br/><br/>
  Details:
  {#if error && error.message}
    <br/><b>{error.message}</b><br/><br/>
  {/if}
  Stack trace:<br/>
  <pre>
  {#if error}
    {error.stack}
  {:else}
    No error details available. See the console for more details.
  {/if}
</pre>
</div>
