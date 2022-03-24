<script>
import { clickOutside } from "src/shared/functions/clickOutside.ts";
import { createEventDispatcher, onMount } from "svelte";

import { dapps } from "src/loader";
import DetailActionBar from "./DetailActionBar.svelte";

let categories = [
  {
    title: "",
    items: [
      {
        title: "",
        action: () => {},
      },
    ],
    component: null,
  },
];

const components = [
  {
    type: "profile",
    component: NotificationViewChatMessage,
  },
  {
    type: "action",
    component: DetailActionBar,
  },
];

onMount(async () => {
  categories = await Promise.all(
    dapps
      .filter((o) => o.jumplist)
      .map(async (o) => {
        let items = await o.jumplist.items({}, o, o);
        return {
          title: o.title,
          actionItems: items
            .filter((o) => o.type == "action")
            .map((p) => {
              return {
                title: p.title,
                icon: p.icon,
                action: p.action,
              };
            }),
          profileItems: items
            .filter((o) => o.type == "profile")
            .map((p) => {
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
  <div class="relative flex-shrink-0 w-full p-6 space-y-2">
    {#each categories as category}
      <div class="text-dark-lightest text-3xs sm:text-sm">
        {category.title}
      </div>
      <div class="">
        <DetailActionBar actions="{category.items}" />
      </div>
    {/each}
  </div>
</div>
