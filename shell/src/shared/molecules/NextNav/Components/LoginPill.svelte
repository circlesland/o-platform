<script lang="ts">
  import {
    identify,
    IdentifyContextData,
  } from "../../../../dapps/o-passport/processes/identify/identify2";

  export let props;

  async function login() {
    /*window.o.runProcess(identify, <IdentifyContextData>{
      redirectTo: "/dashboard",
    });*/
  }

  console.log("PROPS ", props);
</script>

<div class="h-12 col-start-2 py-3 bg-white rounded-full w-36 place-self-center">
  <div
    class="grid grid-cols-2 cursor-pointer justify-items-start "
    on:click="{login}">
    <div class="h-12 -ml-4">
      <svelte:component this="{props.component}" {...props.props} />
    </div>

    <div class="-ml-4 text-xl justify-self-start font-heading">SIGN IN NOW</div>
  </div>
</div>
