<script lang="ts">
  export let props;
  export let isOpen: boolean = false;
  console.log(props);
</script>

<div class="h-12 col-start-2 place-self-center">
  <div class="grid grid-cols-3 justify-items-center">
    {#if props.left}
      <div
        class="w-24 h-12 px-5 py-3 bg-white rounded-full cursor-pointer sm:-mr-12"
      >
        <svelte:component
          this={props.left.component}
          {...props.left.props}
          on:menuButton
        />
      </div>
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
      <div
        class="w-24 h-12 px-12 py-3 bg-white rounded-full cursor-pointer sm:-ml-12"
      >
        <svelte:component this={props.right.component} {...props.right.props} />
      </div>
    {/if}
  </div>
</div>
