<script lang="ts">
  import { Action } from "rxjs/internal/scheduler/Action";
  import { push } from "svelte-spa-router";
  import Icons from "src/shared/molecules/Icons.svelte";

  export let params = {
    headerClass: "bg-primary",
    headerText: "invite 3 pending",
  };
</script>

<section class="flex items-center justify-center mb-3 cursor-pointer">

  <div
    class="flex flex-col items-center w-full space-x-2 bg-white rounded-lg shadow-md">
    <slot name="infoCardHeader">
      <div
        class=" flex items-center justify-center w-full rounded-t-lg h-7 {params.headerClass}
        text-white">
        {params.headerText}
      </div>
    </slot>
    <slot name="infoCardContent" />
  </div>

</section>
