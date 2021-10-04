<script lang="ts">
  import { transfer } from "../processes/transfer";
  // import { TrustObject } from "../data/circles/types";
  // import { tryGetCurrentSafe } from "../init";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import { push } from "svelte-spa-router";

  import ItemCard from "../../../shared/atoms/ItemCard.svelte";

  let pictureUrl: string;
  let displayName: string;
  let safeAddress: string;
  let message: string;

  let id: String;

  function loadDetailPage(path) {
    push(`#/friends/${path}`);
  }

  function execTransfer(recipientAddress?: string) {
    /*
    window.o.runProcess(transfer, {
      recipientAddress,
      safeAddress: tryGetCurrentSafe()?.safeAddress,
      privateKey: sessionStorage.getItem("circlesKey"),
    });
     */
  }
</script>

<div on:click="{() => loadDetailPage(safeAddress)}">
  <ItemCard
    params="{{
      edgeless: false,
      imageUrl: pictureUrl,
      title: displayName,
      subTitle: message,
      truncateMain: true
    }}">
    <div slot="itemCardStart">
      <div class="inline-flex">
        <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
          <img class="rounded-full" src="{pictureUrl}" alt="{displayName}" />
        </div>
      </div>
    </div>
    <div slot="itemCardEnd">
      <div class="self-end text-lg sm:text-3xl">
        <button
          on:click="{e => {
            execTransfer(safeAddress);
            e.stopPropagation();
            return false;
          }}"
          class="self-end text-base ">
          <Icons icon="sendmoney" />
        </button>
      </div>
    </div>
  </ItemCard>
</div>
