<script lang="ts">
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import {ExchangeTokenDocument} from "../../../shared/api/data/types";

  export let params:{
    jwt?:string
  } = {};

  onMount(async () => {
    if (params.jwt)
    {
      const apiClient = await window.o.apiClient.client.subscribeToResult();
      await apiClient.mutate({
        mutation: ExchangeTokenDocument
      });

      push("/#/dashboard");
    } else {
     console.error("Cannot navigate to ExchangeToken.svelte without 'params.jwt' set. Going back to previous page.");
     history.back();
    }
  });

</script>
<div class="grid grid-cols-1 p-2">
  <div class="flex h-screen flex-wrap content-end">
    <div class="m-auto h-auto grid">
      <img
        class="inline m-auto w-12 h-12 -mb-6 z-30"
        src="/images/common/circles.png"
        alt="circles.land"
      />
      <div class="card shadow bg-white z-0">
        Please wait. We're logging you in.
      </div>
    </div>
  </div>
</div>

<div class="font-primary" />
