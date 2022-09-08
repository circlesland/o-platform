<script lang="ts">
import CartItems from "../molecules/CartItems.svelte";
import { purchase } from "../processes/purchase";
import Label from "../../../shared/atoms/Label.svelte";

import { onMount } from "svelte";
import ModalHeader from "../../../shared/atoms/ModalHeader.svelte";

let shippingAddressId: number;

let deliveryType: number = 2;
</script>

<ModalHeader heading="dapps.o-marketplace.pages.shoppingCart.cart" />
<div class="p-5">
  <!--
  {#if deliveryType == 1}
    <div class="form-control">
      <label class="cursor-pointer label">
        <select class="select select-bordered" bind:value="{shippingAddressId}">
          <option value="LIST">Thorsten Schau, Ehrengutstrasse 9</option>
          <option value="TILES">Thorsten Rock c/o Steffi Graf, O-strasse 9, Berlin</option>
        </select>
        <div>
          <button
            class="mt-2 btn btn-sm btn-primary"
            on:click="{() => {
              window.o.runProcess(upsertShippingAddress, {});
            }}">Add Address</button>
        </div>
      </label>
    </div>
  {/if}-->
  <div>
    <div class="w-full">
      <div class="md:flex">
        <div class="w-full">
          <div class="pt-6 md:grid">
            <CartItems />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
