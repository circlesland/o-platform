<script lang="ts">
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import { push } from "svelte-spa-router";

  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import {Contact} from "../../../shared/api/data/types";
  import {onMount} from "svelte";

  export let contact:Contact;

  let pictureUrl: string;
  let displayName: string;
  let safeAddress: string;
  let message: string;

  onMount(() => {
    pictureUrl= contact.contactAddressProfile.avatarUrl ? contact.contactAddressProfile.avatarUrl : AvataarGenerator.generate(contact.contactAddress);
    displayName=`${contact.contactAddressProfile.firstName} ${contact.contactAddressProfile.lastName ? contact.contactAddressProfile.lastName : ''}`
    safeAddress=contact.contactAddress;
    message = "";
    if (contact.trustsYou > 0 && contact.youTrust > 0) {
      message += "mutual trust";
    } else if (!contact.trustsYou && contact.youTrust > 0) {
      message += "trusted by you";
    } else if (contact.trustsYou > 0 && !contact.youTrust) {
      message += "is trusting you";
    } else {
      message += "not trusted"
    }
  })


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

  function goToProfile(e, path?:string) {
    if (!path)
      return;
    e.stopPropagation();
    push(`#/friends/${path}`);
    return false;
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
      <div class="self-end text-lg sm:text-3xl"></div>
    </div>
  </ItemCard>
</div>
