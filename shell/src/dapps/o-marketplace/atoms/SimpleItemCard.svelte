<script lang="ts">
import ItemCard from "../../../shared/atoms/ItemCard.svelte";

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
        class="relative w-10 h-24 overflow-hidden rounded-l-lg sm:w-24 image-wrapper">
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
