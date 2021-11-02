<script lang="ts">

  import {ProfileEvent} from "./api/data/types";
  import {onMount} from "svelte";
  import ItemCard from "./atoms/ItemCard.svelte";
  import Date from "./atoms/Date.svelte";

  export let param: ProfileEvent;

  onMount(async () => {
  });
</script>

<div>
    <ItemCard params={{
      edgeless: false,
      title: `Couldn't find a view for event type '${param.type}'.`,
      subTitle: JSON.stringify(param.payload),
      truncateMain: true
    }}>
        <div slot="itemCardEnd">
            <div class="self-end text-right">
                <span>
                </span>
            </div>
            <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
                {#if param.timestamp}
                    <Date time="{param.timestamp}" />
                {/if}
            </div>
        </div>
    </ItemCard>
</div>
