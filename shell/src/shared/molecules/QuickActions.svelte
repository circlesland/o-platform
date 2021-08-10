<script>
  import { clickOutside } from "src/shared/functions/clickOutside.ts";
  import { createEventDispatcher, onMount } from "svelte";
  import ActionListItem from "src/shared/atoms/ActionListItem.svelte";
  import { dapps } from "src/loader";

  let categories = [
    {
      title: "",
      items: [
        {
          title: "",
          action: () => {},
        },
      ],
    },
  ];

  onMount(async () => {
    categories = await Promise.all(
      dapps
        .filter(o => o.jumplist)
        .map(async o => {
          let items = await o.jumplist.items({}, o, o);
          console.log("ITEMS: ", items);
          return {
            title: o.title,
            items: items.map(p => {
              return {
                title: p.title,
                icon: p.icon,
                action: p.action,
              };
            }),
          };
        })
    );
  });

  const eventDispatcher = createEventDispatcher();
</script>

<div
  class="z-10 flex flex-col flex-1"
  use:clickOutside
  on:click_outside="{() => eventDispatcher('clickedOutside')}">

  <div class="relative flex-shrink-0 w-full p-4 space-y-2">
    {#each categories as catergory}
      <div class="text-dark-lightest text-3xs sm:text-sm">
        {catergory.title}
      </div>
      <div class="flex flex-row items-stretch space-x-4">
        {#each catergory.items as item}
          <ActionListItem
            icon="{item.icon}"
            title="{item.title}"
            on:click="{() => item.action()}" />
        {/each}
      </div>
    {/each}
  </div>
</div>
