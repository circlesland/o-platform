<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import Icons from "./../Icons.svelte";

  export let props;
  export let isOpen: boolean = false;
  console.log(props);

</script>

<div class="grid grid-cols-3 justify-items-center">
  <div class="w-5 h-12 text-secondary">
    <svelte:component this={props.left.component} {...props.left.props} />
  </div>
  <div class="w-16">
    <svelte:component
      this={props.actionButton.component}
      {...props.actionButton.props}
      {isOpen}
      on:actionButton
    />
  </div>
  <div class="w-5 h-12 text-secondary">
    <svelte:component this={props.right.component} {...props.right.props} />
  </div>
</div>
