<script lang="ts">
import Date from "../../../../shared/atoms/Date.svelte";
import { ChatMessage, ProfileEvent } from "../../../../shared/api/data/types";

export let event: ProfileEvent;

</script>

<div>
  <div
    class="flex flex-col flex-grow space-y-1"
    class:order-first="{event.direction == 'out'}">
    <div
      class="relative w-full p-4 text-xs sm:text-sm rounded-xl message chatText"
      class:bg-light-lighter="{event.direction == 'out'}"
      class:bg-dark="{event.direction == 'in'}"
      class:text-white="{event.direction == 'in'}">
      <div
        class="absolute bottom-2 right-3 text-2xs"
        class:text-light-dark="{event.direction == 'out'}"
        class:text-dark-lighter="{event.direction == 'in'}">
        <Date time="{event.timestamp}" />
      </div>
      {@html event.payload.text}
    </div>
  </div>
</div>
