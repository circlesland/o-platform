<script lang="ts">
import { _ } from "svelte-i18n";
import Label from "./Label.svelte";
export let data: {
  error: Error;
};

let error: any;

$: {
  console.error(`An error occurred during the execution of a workflow:`, data);
  if (data && data.error) {
    console.error(data.error);
    error = data.error;
  } else {
    console.error(window.o.lastError);
    error = window.o.lastError;
  }
}
</script>

<div class="w-full bg-white rounded-lg">
  <div class="mt-2 mb-2 alert alert-error">
    <div class="flex-1">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-12 h-12 mx-2 stroke-current">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
      </svg>
      <span class="pt-3 break-all"
        ><h4><strong><Label key="shared.atoms.error.processEncounteredAnError" ></Label></strong></h4>
        <br />
        <span>{error.message}</span>
      </span>
      <br />
    </div>
  </div>
  <div class="mt-4">
    <a href="https://discord.gg/SACzRXa35v">
      <Label key="shared.atoms.error.pleaseTryToReload"></Label><a
        href="https://discord.gg/4DBbRCMnFZ"
        target="_blank"
        class="btn-link">https://discord.gg/4DBbRCMnFZ</a
      ><Label key="shared.atoms.error.ifTheProblemPersists"></Label>
    </a>
  </div>
  <div class="mt-4">
    <center>
      <a href="/"><button class="btn btn-primary">Reload Page</button></a>
    </center>
  </div>
</div>
