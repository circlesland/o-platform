<script lang="ts">
import { push } from "svelte-spa-router";
import Card from "src/shared/atoms/Card.svelte";
import ItemCard from "../../../shared/atoms/ItemCard.svelte";
import { AssetBalance } from "../../../shared/api/data/types";

export let symbol: string;
export let title: string;
export let balance: string;
export let variety: number;
export let description: string;

let pictureUrl: string;

$: {
  pictureUrl = symbol;
}
</script>

<div
  on:click="{() => push(`#/banking/assets/${symbol}`)}"
  class="cursor-pointer">
  <ItemCard
    params="{{
      edgeless: false,
      imageUrl: `/logos/${symbol}.png`,
      title: title,
      subTitle: description,
      truncateMain: true,
      endTextBig: Number.parseFloat(balance).toFixed(2),
      endTextSmall: variety ? variety + ' different ' + title : '',
    }}" />
</div>
