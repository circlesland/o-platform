<script lang="ts">
  import { push } from "svelte-spa-router";
  import ItemCard from "../../../shared/atoms/ItemCard.svelte";

  let pictureUrl: string;
  let displayName: string;
  let safeAddress: string;
  let message: string;

  let id: String;

  function loadDetailPage(path) {
    push(`#/chat/${path}`);
  }

  function goToProfile(e, path?:string) {
    if (!path)
      return;
    e.stopPropagation();
    push(`#/friends/${path}`);
  }
</script>

<div on:click="{() => loadDetailPage(safeAddress)}">
  <ItemCard
    params="{{ edgeless: false, imageUrl: pictureUrl, title: displayName, subTitle: message, truncateMain: true }}">
    <div slot="itemCardStart">
      <div class="inline-flex">
        <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
          <a on:click={(e) => goToProfile(e, safeAddress)}>
            <img class="rounded-full" src="{pictureUrl}" alt="{displayName}" />
          </a>
        </div>
      </div>
    </div>
    <div slot="itemCardEnd">
      <div class="self-end h-6 text-right"></div>
      <div class="self-end text-xs text-dark-lightest whitespace-nowrap">
        <span>5 min ago</span>
      </div>
    </div>
  </ItemCard>
</div>
