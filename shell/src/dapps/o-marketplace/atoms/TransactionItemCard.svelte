<script lang="ts">
import { push } from "svelte-spa-router";

import { Offer } from "../../../shared/api/data/types";
import Icons from "../../../shared/molecules/Icons.svelte";
import ItemCard from "src/shared/atoms/ItemCard.svelte";

import { truncateString } from "../../../shared/functions/truncateString";

import { _ } from "svelte-i18n";
import Label from "../../../shared/atoms/Label.svelte";

export let offer: Offer;

let params = {
  imageUrl: offer.pictureUrl,
  title: offer.title,
  subTitle: truncateString(offer.description, 60),
  truncateMain: true,
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
        class="relative w-16 h-16 overflow-hidden rounded-l-lg image-wrapper">
        <img
          src="{offer.pictureUrl
            ? offer.pictureUrl
            : '/images/market/circles-no-image.jpg'}"
          alt="{offer.title}"
          class="absolute object-cover w-20 h-16 rounded-l-lg" />
      </div>
    </div>
    <div slot="itemCardEnd">
      <div class="w-16 h-16 px-3 py-2 rounded-r-lg title status bg-success">
        <div class="mt-1 overflow-hidden text-center">
          <div class="px-2">
            <Icons icon="home" />
          </div>
          <span class="block mt-1 text-3xs"><Label key="dapps.o-marketplace.atoms.transactionItemCard.sending"  /></span>
        </div>
      </div>
    </div>
  </ItemCard>
</div>
