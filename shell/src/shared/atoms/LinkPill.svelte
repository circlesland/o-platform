<script lang="ts">
  import Icons from "./../molecules/Icons.svelte";
  export let props: {
    icon: string;
    text: string;
    link: string;
    extern: boolean = false;
    isActive: boolean = false;
  };
  console.log("PROPS", props);
</script>

<a
  href={props.extern ? props.link : '/#/' + props.link}
  class="flex content-center justify-start space-x-2"
  target={props.extern ? '_blank' : '_self'}
>
  <div
    class="flex flex-row px-4 py-2 space-x-2 rounded-full "
    class:bg-dark={props.isActive}
    class:text-white={props.isActive}
    class:bg-white={!props.isActive}
  >
    {#if props.icon}
      <Icons icon={props.icon} size={4} />
    {/if}
    {#if props.text}
      <div class="text-xs">{props.text}</div>
    {/if}
  </div>
</a>
