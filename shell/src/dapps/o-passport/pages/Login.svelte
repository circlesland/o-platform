<!--
 TODO: Login via Link is currently not used. Replace it with a "Trigger"-Routable.
 -->
<script lang="ts">
import { onMount } from "svelte";

import { identify, IdentifyContextData } from "../processes/identify/identify2";

export let params: {
  code: string;
  redirectTo: string;
};

onMount(() => {
  if (!params.code) {
    throw new Error(`Can't login: No one time code supplied.`);
  }
  window.o.runProcess(identify, <IdentifyContextData>{
    oneTimeCode: params.code,
    redirectTo: "/home",
  });
});
</script>

<div class="grid grid-cols-1 p-2">
  <div class="flex h-screen ">
    <div class="m-auto grid">
      <img
        class="inline m-auto w-12 h-12 -mb-6 z-30"
        src="/images/common/circles.png"
        alt="circles.land" />
      <div class="card shadow bg-white z-0">
        <div class="card-body"></div>
      </div>
    </div>
  </div>
</div>

<div class="font-primary"></div>
