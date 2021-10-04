<script lang="ts">
  import { transfer } from "../../o-banking/processes/transfer";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";
  import Icons from "../../../shared/molecules/Icons.svelte";
  import { push } from "svelte-spa-router";

  import ItemCard from "../../../shared/atoms/ItemCard.svelte";
  import {Contact, TrustRelation} from "../../o-banking/data/api/types";
  import {Profile} from "../../o-chat/data/api/types";
  import {onMount} from "svelte";

  export let trustRelation:TrustRelation = null;
  export let contact:Contact = null;

  let id: String;
  let profile: Profile;

  onMount(() => {
    if (trustRelation) {
      profile = trustRelation.otherSafeAddressProfile;
    } else if (contact) {
      profile = contact.contactAddressProfile;
    }

    if (!profile && contact) {
      profile = {
        id:0,
        firstName: contact.contactAddress,
        lastName: "",
        circlesAddress: contact.contactAddress,
      }
    }

    if (profile && !profile.lastName) {
      profile.lastName = "";
    }
    if (profile && !profile.avatarUrl) {
      profile.avatarUrl = AvataarGenerator.generate(contact.contactAddress);
    }
  });

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

{#if profile}
<div on:click="{() => loadDetailPage(profile.circlesAddress)}">
  {#if !trustRelation}
    <ItemCard params="{{
      edgeless: false,
      imageUrl: profile.avatarUrl,
      title: profile.firstName + (profile.lastName ? ' ' +profile.lastName : ''),
      subTitle: '',
      truncateMain: true
    }}">
      <div slot="itemCardStart">
        <div class="inline-flex">
          <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
            <img class="rounded-full"  src="{profile.avatarUrl}"
                 alt="{profile.firstName + (profile.lastName ? ' ' +profile.lastName : '')}" />
          </div>
        </div>
      </div>
      <div slot="itemCardEnd">
        <div class="self-end text-lg sm:text-3xl"></div>
      </div>
    </ItemCard>
  {:else if trustRelation.direction === "MUTUAL"}
    <ItemCard params="{{
      edgeless: false,
      imageUrl: profile.avatarUrl,
      title: profile.firstName + (profile.lastName ? ' ' +profile.lastName : ''),
      subTitle: '',
      truncateMain: true
    }}">
      <div slot="itemCardStart">
        <div class="inline-flex">
          <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
            <img class="rounded-full"  src="{profile.avatarUrl}"
                 alt="{profile.firstName + (profile.lastName ? ' ' +profile.lastName : '')}" />
          </div>
        </div>
      </div>
      <div slot="itemCardEnd">
        <div class="self-end text-lg sm:text-3xl"></div>
      </div>
    </ItemCard>
  {:else if trustRelation.direction === "IN"}
    <ItemCard params="{{
      edgeless: false,
      imageUrl: profile.avatarUrl,
      title: profile.firstName + (profile.lastName ? ' ' +profile.lastName : ''),
      subTitle: '',
      truncateMain: true
    }}">
      <div slot="itemCardStart">
        <div class="inline-flex">
          <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
            <img  class="rounded-full"  src="{profile.avatarUrl}"
                 alt="{profile.firstName + (profile.lastName ? ' ' +profile.lastName : '')}" />
          </div>
        </div>
      </div>
      <div slot="itemCardEnd">
        <div class="self-end text-lg sm:text-3xl"></div>
      </div>
    </ItemCard>
  {:else}
    <ItemCard params="{{
      edgeless: false,
      imageUrl: profile.avatarUrl,
      title: profile.firstName + (profile.lastName ? ' ' +profile.lastName : ''),
      subTitle: '',
      truncateMain: true
    }}">
      <div slot="itemCardStart">
        <div class="inline-flex">
          <div class="m-auto mt-1 rounded-full w-11 h-11 sm:w-12 sm:h-12">
            <img class="rounded-full" src="{profile.avatarUrl}"
                 alt="{profile.firstName + (profile.lastName ? ' ' +profile.lastName : '')}" />
          </div>
        </div>
      </div>
      <div slot="itemCardEnd">
        <div class="self-end text-lg sm:text-3xl"></div>
      </div>
    </ItemCard>
  {/if}
</div>
{/if}