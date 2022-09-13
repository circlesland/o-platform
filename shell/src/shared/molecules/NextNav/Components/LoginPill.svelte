<script lang="ts">
import Label from "../../../atoms/Label.svelte";
import { onMount } from "svelte";
import { _ } from "svelte-i18n";

export let props;

async function login() {
  window.runInitMachine();
}

onMount(() => {
  setTimeout(() => {
    if (sessionStorage.getItem("desiredRoute") && !sessionStorage.getItem("notFirst")) {
      login();
    }
  }, 30);
});
</script>

<div class="h-12 col-start-2 py-3 bg-white rounded-full w-36 place-self-center">
  <div class="grid grid-cols-2 cursor-pointer justify-items-start " on:click="{login}">
    <div class="h-12 -ml-4">
      <svelte:component this="{props.component}" {...props.props} />
    </div>

    <div class="-ml-4 text-xl justify-self-start font-heading">
      <Label key="shared.molecules.nextNav.components.loginPill.signInNow" />
    </div>
  </div>
</div>
