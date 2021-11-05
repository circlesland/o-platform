<script lang="ts">
import { push } from "svelte-spa-router";

import { Offer } from "../../../shared/api/data/types";
import Icons from "../../../shared/molecules/Icons.svelte";
import ItemCard from "src/shared/atoms/ItemCard.svelte";

import { truncateString } from "../../../shared/functions/truncateString";

//   export let offer: Offer;

let params = {
  imageUrl:
    "https://images.unsplash.com/photo-1571753197835-877a43b7e352?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8aGVsaWNvcHRlciUyMHRveXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
  title: "Bavarian Barbarian",
  subTitle:
    "This is something i like, but i'm selling it because i'm broke and need the Money. you'll love it though, i'm sure of it <3.",

  noTruncate: true,
  edgeless: true,
};

function loadDetailPage() {
  push("#/marketplace/offer/" + offer.id);
}
</script>

<div on:click="{() => loadDetailPage()}">
  <ItemCard params="{params}">
    <div slot="itemCardStart">
      <div
        class="relative w-24 h-24 overflow-hidden rounded-l-lg image-wrapper">
        <img
          src="{params.imageUrl
            ? params.imageUrl
            : '/images/market/circles-no-image.jpg'}"
          alt="{params.title}"
          class="absolute object-cover w-24 h-24 rounded-l-lg" />
      </div>
    </div>
    <div slot="itemCardEnd"></div>
  </ItemCard>
</div>
