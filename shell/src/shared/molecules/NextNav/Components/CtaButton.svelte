<script lang="ts">
  import Icons from "./../Icons.svelte";

  export let icon: any = null;
  export let action: any = null;
  export let event: any = null;

</script>

<div on:click={() => loadLink()} class="cursor-pointer">
  <Icons {icon} />
  <button
    on:click={() => window.o.publishEvent(action.event(event))}
    class="w-full btn {action.key == 'logout'
      ? 'btn-error'
      : 'btn-primary btn-outline bg-white'}  "
  >
    <Icons {icon} />{action.label}</button
  >
</div>
