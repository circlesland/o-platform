<script lang="ts">
import { Offer } from "../../../shared/api/data/types";
import { Purchase } from "../../../shared/api/data/types";
import Icons from "../../../shared/molecules/Icons.svelte";
import ItemCard from "src/shared/atoms/ItemCard.svelte";

import { truncateString } from "../../../shared/functions/truncateString";

//   export let offer: Offer;

export let params = {
  imageUrl: null,
  imageAlt: null,
  title: null,
  subTitle: null,
  noTruncate: null,
  edgeless: null,
  inline: false,
  shadowSmall: true,
  shadowMedium: null,
  noShadow: false,
  action: null,
  imageAction: null,
  endTextBig: null,
  endTextBigClass: "text-success",
  endTextSmall: null,
  imageProfile: null,
  profileLink: null,
  noLink: false,
  class: null,
};
</script>

<div>
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
  </ItemCard>
</div>
