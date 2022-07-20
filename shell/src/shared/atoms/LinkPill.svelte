<script lang="ts">
import Icons from "./../molecules/Icons.svelte";
import { media } from "../stores/media";
import {_} from "svelte-i18n";

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
    class="flex flex-row items-center px-4 py-2 space-x-2 rounded-full"
    class:bg-dark="{props.isActive && !$media.small}"
    class:text-white="{props.isActive}"
    class:bg-white="{!props.isActive && !$media.small}"
    class:text-light="{!props.isActive && $media.small}"
    class:shadow-sm="{!$media.small}"
    class:text-lg="{$media.small && !props.isSmall}"
    class:text-2xl="{props.isActive && $media.small && !props.isSmall}"
    class:text-2xs="{props.isSmall && !$media.small}"
    class:text-sm="{props.isSmall && $media.small}">
    {#if props.icon}
      <Icons icon="{props.icon}" size="{iconsize}" />
    {/if}
    {#if !props.i18nKey && props.text}
      <div>{props.text}</div>
    {:else if props.i18nKey}
      {$_(props.i18nKey)}
    {/if}
  </div>
</a>
