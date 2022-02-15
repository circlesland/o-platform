<script lang="ts">
  import Icons from "./../../Icons.svelte";
  import { inbox } from "../../../stores/inbox";
</script>

<div class="relative text-secondary">
  <Icons icon="notificationbubble" />
  <div class="absolute top-0 w-full text-center text-white font-heading">
    {$inbox.length}asd
  </div>
</div>
