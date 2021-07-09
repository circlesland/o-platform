<script lang="ts">
  import { createEventDispatcher } from "svelte";
  export let props;
  export let isOpen: boolean = false;

  const dispatch = createEventDispatcher();

  function action(action) {
    dispatch("actionButton", {
      action: action,
    });
  }
</script>

<div class="h-12 col-start-2 place-self-center">
  <div class="flex flex-row">
    {#if props.left}
      <div
        class="flex justify-center flex-shrink-0 w-20 h-12 -mr-4 bg-white rounded-l-full cursor-pointer"
        on:click={props.left.props.action}
      >
        <div
          class="self-center"
        >
          <svelte:component
            this={props.left.component}
            {...props.left.props}
            on:menuButton
          />
        </div>
      </div>
    {/if}
    <div class="z-50 flex-shrink-0 w-16 col-start-2 mt-3 ml-1 cursor-pointer"
         on:click={props.center.props.action}>
      <svelte:component
        this={props.center.component}
        {...props.center.props}
        on:actionButton
      />
    </div>
    {#if props.right}
      <div
        class="flex justify-center flex-shrink-0 w-20 h-12 -ml-4 bg-white rounded-r-full cursor-pointer "
        on:click={props.right.props.action}
      >
        <div
          class="self-center"
        >
          <svelte:component
            this={props.right.component}
            {...props.right.props}
          />
        </div>
      </div>
    {/if}
  </div>
</div>
