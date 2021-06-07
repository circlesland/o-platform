<script lang="ts">
  import {me} from "../../../shared/stores/me";
  import {onMount} from "svelte";
  import TrustNetworkHeader from "../atoms/TrustNetworkHeader.svelte";

  const {mySafe} = require("src/dapps/o-banking/stores/safe");

  $: me;

  const init = async () => {
  };

  onMount(init);

  const sub = window.o.events.subscribe((event) => {
    if (event.type !== "shell.refresh") {
      return;
    }
    init();
  });

  $: {
  }
</script>

<TrustNetworkHeader />
<div class="mx-4">
</div>
