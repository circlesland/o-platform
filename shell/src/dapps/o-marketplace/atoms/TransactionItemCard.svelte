<script lang="ts">
  import { push } from "svelte-spa-router";

  import { Offer } from "../data/api/types";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import ItemCard from "src/shared/atoms/ItemCard.svelte";

  export let offer: Offer;

  let params = {
    imageUrl: offer.pictureUrl,
    title: offer.title,
    subTitle: offer.description,
    truncateMain: true,
    edgeless: true,
    shadow: true,
    action: push("#/marketplace/offer/" + offer.id),
  };
</script>

<ItemCard {params} />
