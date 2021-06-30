<script lang="ts">
  export let props;
  export let isOpen: boolean = false;
  console.log(props);
</script>

<div class="h-12 col-start-2 place-self-center">
  <div class="grid grid-cols-3 justify-items-center">
    {#if props.left}
      <svelte:component
        this={props.left.component}
        {...props.left.props}
        on:menuButton
      />
    {/if}
    <div class="z-50 w-16 col-start-2 mt-3 ml-1 cursor-pointer">
      <svelte:component
        this={props.actionButton.component}
        {...props.actionButton.props}
        {isOpen}
        on:actionButton
      />
    </div>
    {#if props.right}
      <svelte:component this={props.right.component} {...props.right.props} />
    {/if}
  </div>
</div>
