<script lang="ts">
  import {inbox} from "../../../stores/inbox";

  export let props;



</script>

<div class="h-12 col-start-2 place-self-center">
  <div class="flex flex-row">
    <div
      class="flex justify-center flex-shrink-0 w-20 h-12 -mr-4 rounded-l-full cursor-pointer"
      class:bg-white={props && props.left}
      on:click={props && props.left ? props.left.props.action : null}
    >

      {($inbox).length}


      {#if props && props.left}
        <div class="self-center">
          <svelte:component
            this={props.left.component}
            {...props.left.props}
            on:menuButton
          />
        </div>
      {/if}
    </div>

    <div
      class="z-50 flex-shrink-0 w-16 col-start-2 mt-3 ml-1 cursor-pointer"
    >
      {#if props && props.center}
      <svelte:component
        this={props.center.component}
        {...props.center.props}
        on:actionButton
      />
      {/if}
    </div>

    <div
      class="flex justify-center flex-shrink-0 w-20 h-12 -ml-4 rounded-r-full cursor-pointer "
      class:bg-white={props && props.right}
      on:click={props.right ? props.right.props.action : null}
    >
      {#if props && props.right}
        <div class="self-center">
          <svelte:component
            this={props.right.component}
            {...props.right.props}
          />
        </div>
      {/if}
    </div>
  </div>
</div>
