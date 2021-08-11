<script lang="ts">
  import {
    identify,
    IdentifyContextData,
  } from "../../../../dapps/o-passport/processes/identify/identify";

  export let props;

  async function login() {
    window.o.runProcess(identify, <IdentifyContextData>{
      redirectTo: "/dashboard",
    });
  }
</script>

<div
  class="h-12 col-start-2 py-3 bg-white rounded-full w-36 place-self-center text-primary-dark ">
  <div
    class="grid grid-cols-2 cursor-pointer justify-items-start "
    on:click="{login}">
    <div class="h-12 -ml-2">
      <svelte:component
        this="{props.actionButton.component}"
        {...props.actionButton.props} />
    </div>

    <div class="pt-1 -ml-1 justify-self-start">Sign In</div>
  </div>
</div>
