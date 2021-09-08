<script lang="ts">
  import {
    identify,
    IdentifyContextData,
  } from "../../../dapps/o-passport/processes/identify/identify";

  async function login() {
    window.o.runProcess(identify, <IdentifyContextData>{
      redirectTo: "/dashboard",
    });
  }
</script>

<section class="flex flex-col items-center justify-center p-6 space-y-6">
  <slot name="EditorSteps">
    <!-- <div>
      <NavSteps steps="{[0, 0, 0]}" />
    </div> -->
  </slot>
  <slot name="EditorTitle">
    <div class="w-full text-center">
      <h1 class="text-3xl uppercase font-heading">Log In or Sign Up</h1>
    </div>
  </slot>
  <slot name="EditorDescription">
    <div class="w-full text-center">
      <span class="text-dark-lightest">Hier wird was erklärt</span>
    </div>
  </slot>
  <div class="flex flex-col w-full space-y-4">
    <button class="btn btn-primary btn-block">ONE</button>
    <button class="btn btn-secondary btn-block">TWO</button>
    <button class="btn btn-info btn-block">THREE</button>
  </div>

</section>
