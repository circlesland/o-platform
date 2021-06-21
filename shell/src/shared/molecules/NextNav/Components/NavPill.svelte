<script lang="ts">
  export let props;
  export let isOpen: boolean = false;
  console.log(props);

</script>

<div
  class="h-12 col-start-2 px-2 py-3 bg-white rounded-full place-self-center w-44"
>
  <div class="grid grid-cols-3 justify-items-center">
    <div class="w-5 h-12 cursor-pointer">
      <svelte:component
        this={props.left.component}
        {...props.left.props}
        on:menuButton
      />
    </div>
    <div class="w-16 ml-1 cursor-pointer">
      <svelte:component
        this={props.actionButton.component}
        {...props.actionButton.props}
        {isOpen}
        on:actionButton
      />
    </div>
    <div class="w-5 h-12 cursor-pointer">
      <svelte:component this={props.right.component} {...props.right.props} />
    </div>
  </div>
</div>
