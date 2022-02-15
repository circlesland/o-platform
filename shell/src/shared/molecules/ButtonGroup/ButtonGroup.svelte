<script lang="ts">
import { createEventDispatcher } from "svelte";
import { UserActions, UserActionItem } from "../../userActions";
import Button from "../../atoms/button/Button.svelte";
import ButtonGroupLayout from "./ButtonGroupLayout";
import ButtonContext from "../../atoms/button/buttonContext";

export let actions: UserActionItem[];
export let layout: ButtonGroupLayout;

const dispatch = createEventDispatcher();
let buttons: ButtonContext[] = [];

$: {
  actions.forEach((action, i) => {
    buttons.push({
      label: action.title,
      color: layout.colors.default,
      style: layout.orientation,
      action: async () => action.action(),
    });
  });

  actions.forEach((action, i) => {
    if (layout.colors.overrides) {
      let OverrideColor =
        typeof layout.colors.overrides == "string"
          ? layout.colors.overrides
          : layout.colors.overrides(action);

      if (OverrideColor) {
        buttons[i].color = OverrideColor;
      }
    }
    if (layout.labels && layout.labels[action.key]) {
      let OverrideLabel =
        typeof layout.labels[action.key] == "string"
          ? layout.labels[action.key]
          : layout.labels[action.key](action);

      if (OverrideLabel) {
        buttons[i].label = OverrideLabel;
      }
    }
  });
}

function submit() {
  dispatch("submit");
}
</script>

{#if actions}
  <div
    class="flex w-full"
    class:justify-left="{layout.alignment == 'left'}"
    class:justify-center="{layout.alignment == 'center'}"
    class:justify-right="{layout.alignment == 'right'}"
    class:flex-col="{layout.orientation == 'stack'}"
    class:space-y-4="{layout.orientation == 'stack'}"
    class:flex-row="{layout.orientation == 'inline'}"
    class:space-x-4="{layout.orientation == 'inline'}">
    {#each buttons as button, i}
      <Button context="{button}" on:submit="{submit}" />
    {/each}
  </div>
{/if}
