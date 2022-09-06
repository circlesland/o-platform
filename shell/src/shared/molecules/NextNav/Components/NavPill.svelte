<script lang="ts">
import { showNotifications } from "../../../processes/showNotifications";
import { inbox } from "../../../stores/inbox";
import Icons from "../../Icons.svelte";

export let props;

function clickHandler() {
  if ($inbox.length && $inbox.length && props.center.props.icon !== "close") {
    window.o.runProcess(
      showNotifications,
      {
        events: $inbox.map((o) => o),
      },
      {
        events: false,
        currentEvent: false,
        currentEventIndex: false,
      }
    );
  } else {
    if (props && props.left) {
      props.left.props.action();
    }
  }
}
</script>

<div class="h-12 col-start-2 place-self-center">
  <div class="flex flex-row">
    <div
      class="flex justify-center flex-shrink-0 -mr-4 rounded-l-full cursor-pointer w-14 h-11"
      class:bg-purple="{props && props.left}"
      on:click="{clickHandler}">
      {#if props && props.left}
        {#if $inbox.length && $inbox.length && props.center.props.icon !== "close"}
          <div class="relative self-center mr-2 text-secondary" on:click="{clickHandler}">
            <Icons icon="notificationbubble" />
            <div class="absolute top-0 w-full text-center text-white font-heading">
              {$inbox.length}
            </div>
          </div>
        {:else}
          <div class="flex flex-col self-center justify-center h-full">
            <svelte:component this="{props.left.component}" {...props.left.props} on:menuButton />
          </div>
        {/if}
      {/if}
    </div>

    <div class="z-50 flex-shrink-0 w-16 col-start-2 mt-3 ml-1 cursor-pointer">
      {#if props && props.center}
        <svelte:component this="{props.center.component}" {...props.center.props} on:actionButton />
      {/if}
    </div>

    <div
      class="flex justify-center flex-shrink-0 -ml-4 rounded-r-full cursor-pointer w-14 h-11 "
      class:bg-purple="{props && props.right}"
      on:click="{props.right ? props.right.props.action : null}">
      {#if props && props.right}
        <div class="flex flex-col self-center justify-center h-full ml-1 text-white">
          <svelte:component this="{props.right.component}" {...props.right.props} />
        </div>
      {/if}
    </div>
  </div>
</div>
