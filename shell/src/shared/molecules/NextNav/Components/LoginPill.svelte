<script lang="ts">
  import {
    runShellProcess
  } from "../../../processes/shellProcess";
  import {
    identify,
    IdentifyContextData,
  } from "../../../../dapps/o-passport/processes/identify/identify";

  export let props;
  export let isOpen: boolean = false;

  async function login() {
    window.o.publishEvent(runShellProcess(identify, <IdentifyContextData>{
      redirectTo: "/dashboard",
    }));
  }

</script>

<div
  class="h-12 col-start-2 py-3 bg-white rounded-full w-36 place-self-center text-primarydark "
>
  <div
    class="grid grid-cols-2 cursor-pointer justify-items-start "
    on:click={login}
  >
    <div class="h-12 -ml-2">
      <svelte:component
        this={props.actionButton.component}
        {...props.actionButton.props}
        {isOpen}
      />
    </div>

    <div class="-ml-1 justify-self-start">Sign In</div>
  </div>
</div>
