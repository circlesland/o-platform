<script lang="ts">
import Icons from "./../molecules/Icons.svelte";
import { media } from "../stores/media";
import Label from "./Label.svelte";

export let props: {
  icon: string;
  text: string;
  i18nKey: string;
  link: string;
  extern: boolean;
  isActive: boolean;
  isSmall: boolean;
};
// console.log("PROPS", props);
let iconsize: number = 4;
if ($media.small) {
  iconsize = 6;
  if (props.isActive) {
    iconsize = 8;
  }
}
</script>

<a
  href="{props.extern ? props.link : '/#/' + props.link}"
  class="flex content-center justify-start space-x-2"
  data-i18n-key="{props.i18nKey}"
  target="{props.extern ? '_blank' : '_self'}"
  on:click="{() => {
    if ($media.small) {
      window.o.publishEvent({ type: 'shell.closeNavigation' });
    }
  }}">
  <div
    class="flex flex-row items-center mt-2 rounded-full"
    class:btn="{props.isActive}"
    class:btn-outline="{props.isActive}"
    class:btn-sm="{props.isActive}"
    class:btn-base="{props.isActive}"
    class:text-base="{props.isActive}"
    class:text-lg="{$media.small && !props.isSmall}"
    class:text-2xs="{props.isSmall && !$media.small}"
    class:text-sm="{props.isSmall && $media.small}">
    {#if props.icon}
      <span class="pl-1">
        <Icons icon="{props.icon}" size="{iconsize}" />
      </span>
    {/if}

    {#if !props.i18nKey && props.text}
      {props.text}
    {:else if props.i18nKey}
      <span class="px-2">
        <Label key="{props.i18nKey}" />
      </span>
    {/if}
  </div>
</a>
