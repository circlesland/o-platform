<script lang="ts">
  import Icons from "./../molecules/Icons.svelte";
  import { isMobile } from "src/shared/functions/isMobile";

  export let props: {
    icon: string;
    text: string;
    link: string;
    extern: boolean;
    isActive: boolean;
    isSmall: boolean;
  };
  // console.log("PROPS", props);
  let iconsize: number = 4;
  if (isMobile()) {
    iconsize = 6;
    if (props.isActive) {
      iconsize = 8;
    }
  }
</script>

<a
  href="{props.extern ? props.link : '/#/' + props.link}"
  class="flex content-center justify-start space-x-2"
  target="{props.extern ? '_blank' : '_self'}"
  on:click="{() => {
    if (isMobile()) {
      window.o.publishEvent({ type: 'shell.closeNavigation' });
    }
  }}">
  <div
    class="flex flex-row items-center px-4 py-2 space-x-2 rounded-full"
    class:bg-dark="{props.isActive && !isMobile()}"
    class:text-white="{props.isActive}"
    class:bg-white="{!props.isActive && !isMobile()}"
    class:text-light="{!props.isActive && isMobile()}"
    class:shadow-sm="{!isMobile()}"
    class:text-lg="{isMobile() && !props.isSmall}"
    class:text-2xl="{props.isActive && isMobile() && !props.isSmall}"
    class:text-2xs="{props.isSmall && !isMobile()}"
    class:text-sm="{props.isSmall && isMobile()}">
    {#if props.icon}
      <Icons icon="{props.icon}" size="{iconsize}" />
    {/if}
    {#if props.text}
      <div>{props.text}</div>
    {/if}
  </div>
</a>
