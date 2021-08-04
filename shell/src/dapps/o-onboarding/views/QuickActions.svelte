<script>
  import { clickOutside } from "src/shared/functions/clickOutside.ts";
  import {createEventDispatcher, onMount} from "svelte";
  import {dapps} from "../../../loader";

  let categories = [{
    title: "",
    items: [{
      title: "",
      action: () => {}
    }]
  }];

  onMount(async () => {
    categories = await Promise.all(dapps.filter(o => o.jumplist).map(async o => {
      let items = await o.jumplist.items({}, o, o);
      return {
        title: o.title,
        items: items.map(p => {
          return {
            title: p.title,
            action: p.action
          }
        })
      }
    }));
  });

  const eventDispatcher = createEventDispatcher();
</script>

<div
  class="z-10 flex flex-col flex-1"
  use:clickOutside
  on:click_outside="{() => eventDispatcher('clickedOutside')}">

  <div class="relative flex-shrink-0 p-4 pt-4 pb-20 space-y-2 w-52">
    {#each categories as catergory}
      <div>
        {catergory.title}
      </div>
      <hr/>
      {#each catergory.items as item}
        <div on:click={() => item.action()}>
          &gt; {item.title}
        </div>
      {/each}
    {/each}
  </div>
</div>

<style>

</style>
