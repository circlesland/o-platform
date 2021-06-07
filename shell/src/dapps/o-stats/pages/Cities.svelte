<script lang="ts">
  import {me} from "../../../shared/stores/me";
  import {onMount} from "svelte";
  import StatsHeader from "../atoms/StatsHeader.svelte";

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

<StatsHeader />
<div class="mx-4">
</div>
