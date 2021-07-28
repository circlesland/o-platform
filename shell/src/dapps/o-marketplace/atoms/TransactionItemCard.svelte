<script lang="ts">
  import { push } from "svelte-spa-router";

  import { Offer } from "../data/api/types";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import ItemCard from "src/shared/atoms/ItemCard.svelte";

  import { truncateString } from "../../../shared/functions/truncateString";

  export let offer: Offer;

  let params = {
    imageUrl: offer.pictureUrl,
    title: offer.title,
    subTitle: truncateString(offer.description, 60),
    truncateMain: true,
    edgeless: true,
    shadow: true,
  };

  function loadDetailPage() {
    push("#/marketplace/offer/" + offer.id);
  }
</script>

<div on:click={() => loadDetailPage()}>
  <ItemCard {params} />
</div>
