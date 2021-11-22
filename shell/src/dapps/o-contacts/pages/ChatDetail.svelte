<script lang="ts">
import { onDestroy, onMount, afterUpdate } from "svelte";
import NotificationCard from "../atoms/NotificationCard.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {
  AggregatesDocument,
  AggregateType,
  Contact,
  Contacts,
  CrcBalances,
  EventType,
  Profile,
  ProfileAggregate,
  ProfileEvent,
  SendMessageDocument,
  SortOrder,
  StreamDocument,
} from "../../../shared/api/data/types";
import { me } from "../../../shared/stores/me";
import UserImage from "src/shared/atoms/UserImage.svelte";
import { push } from "svelte-spa-router";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";

export let id: string;

let error: string | undefined = undefined;
let chatHistory: ProfileEvent[] = [];

let contactProfile: Profile | null;
let shellEventSubscription: Subscription;

async function reload() {
  const apiClient = await window.o.apiClient.client.subscribeToResult();

  const contactsResult = await apiClient.query({
    query: AggregatesDocument,
    variables: {
      types: [AggregateType.Contacts],
      safeAddress: $me.circlesAddress,
      filter: {
        contacts: {
          addresses: [id],
        },
      },
    },
  });

  if (contactsResult.errors?.length > 0) {
    throw new Error(`Couldn't read the contacts of safe ${$me.circlesAddress}`);
  }

  const contacts: ProfileAggregate = contactsResult.data.aggregates.find(
    (o) => o.type == AggregateType.Contacts
  );
  if (!contacts) {
    throw new Error(
      `Couldn't find the AggregateType.Contacts in the query result.`
    );
  }

  if ((<Contacts>contacts.payload).contacts.length > 0) {
    contactProfile = (<Contacts>contacts.payload).contacts[0]
      .contactAddress_Profile;
  }

  const result = await apiClient.query({
    query: StreamDocument,
    variables: {
      safeAddress: $me.circlesAddress,
      pagination: {
        order: SortOrder.Asc,
        limit: 1000000,
        continueAt: new Date(0),
      },
      filter: {
        with: id,
      },
      types: [
        EventType.CrcHubTransfer,
        //EventType.CrcMinting,
        EventType.CrcTrust,
        EventType.ChatMessage,
        //EventType.CrcSignup,
        //EventType.CrcTokenTransfer,
        //EventType.EthTransfer,
        //EventType.GnosisSafeEthTransfer,
        //EventType.InvitationCreated,
        EventType.InvitationRedeemed,
        //EventType.MembershipOffer,
        //EventType.MembershipAccepted,
        //EventType.MembershipRejected
      ],
    },
  });

  // TODO: Load the contact

  chatHistory = (<any>result).data.events.map((o) => {
    return {
      original: o,
      contactProfile: o.contact_address_profile
        ? o.contact_address_profile
        : {
            circlesAddress: o.contact_address,
            firstName: o.contact_address,
          },
    };
  });

  window.o.publishEvent(<any>{
    type: "shell.scrollToBottom",
    scrollNow: true,
  });
}

onMount(async () => {
  shellEventSubscription = window.o.events.subscribe(
    async (event: PlatformEvent) => {
      if (event.type != "shell.refresh" || (<any>event).dapp != "chat:1") {
        return;
      }
      await reload();
    }
  );
  await reload();
});

onDestroy(() => shellEventSubscription.unsubscribe());

let inputField: any;
let chatmessage: string;

const sendMessage = async (text) => {
  const apiClient = await window.o.apiClient.client.subscribeToResult();

  // If we're acting as organisation then we need to specify a "fromSafeAddress"
  const result = await apiClient.mutate({
    mutation: SendMessageDocument,
    variables: {
      fromSafeAddress: $me.circlesAddress,
      toSafeAddress: id,
      content: text,
    },
  });

  if (result.data?.sendMessage?.success) {
    chatHistory = [
      ...chatHistory,
      <any>{
        original: result.data.sendMessage.event,
      },
    ];
  }

  window.o.publishEvent(<any>{
    type: "shell.scrollToBottom",
    scrollNow: true,
  });
  window.o.publishEvent(<any>{
    type: "shell.refresh",
    dapp: "chat:1",
    data: null,
  });
};

function init(el) {
  el.focus();
}

onMount(() => {
  // TEMPORARY FIX UNTIL THE LIST IS WORKING BETTER
  setTimeout(function () {
    window.o.publishEvent(<any>{
      type: "shell.scrollToBottom",
      scrollNow: true,
    });
  }, 2500);
});

async function submitChat() {
  if (!chatmessage) {
    return;
  }

  sendMessage(chatmessage);

  chatmessage = null;
  // let textarea = document.querySelector("textarea");
  // textarea.style.cssText = "height:auto; padding:0 padding-top: 2px;";
}

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter" && !e.shiftKey) {
    submitChat();
  }
}

function goToProfile(e, path?: string) {
  if (!path) return;
  e.stopPropagation();
  push(`#/friends/${path}`);
}
</script>

<div id="chatlist">
  <header
    class="sticky top-0 z-50 grid w-full bg-white place-content-center rounded-t-xl">
    <div
      class="relative flex flex-col items-center self-center w-full m-auto text-center justify-self-center">
      <div class="absolute " style="left: -56px; top:4px">
        {#if contactProfile}
          <UserImage
            profile="{contactProfile}"
            size="{10}"
            gradientRing="{true}" />
        {/if}
      </div>
      <div class="mt-2 text-3xl tracking-wide uppercase font-heading">
        {#if contactProfile}
          {contactProfile.firstName}
          {contactProfile.lastName ? contactProfile.lastName : ""}
        {/if}
      </div>

      {#if contactProfile}
        <div class="pb-2 text-xs">
          {#if contactProfile.youTrust > 0 && contactProfile.trustsYou > 0}
            Mutual trust
          {:else if contactProfile.youTrust > 0 && !contactProfile.trustsYou}
            You trust {contactProfile.contactAddressProfile.firstName}
          {:else if contactProfile.trustsYou > 0}
            {contactProfile.contactAddressProfile.firstName} trusts you
          {/if}
        </div>
      {/if}
    </div>
  </header>

  <!-- TODO: Add ChatNotificationCard type - check how many we need! -->
  <div class="flex flex-col pb-0 space-y-4 sm:space-y-8">
    {#each chatHistory as event}
      <NotificationCard event="{event.original}" />
    {/each}
    <div id="endOfList"></div>
  </div>
  {#if contactProfile && contactProfile.type != null}
    <div
      class:hidden="{!contactProfile || !contactProfile.id}"
      class="sticky bottom-0 flex flex-row order-1 w-full p-2 pb-0 space-x-4 bg-white sm:p-6 sm:pt-2 rounded-b-xl">
      <div class="flex-grow">
        <input
          bind:this="{inputField}"
          on:keydown="{onkeydown}"
          bind:value="{chatmessage}"
          use:init
          type="text"
          name="searchTerm"
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          placeholder="Your Message"
          class="order-1 w-full input input-bordered" />
        <!-- <textarea
        on:keydown="{onkeydown}"
        name="searchTerm"
        rows="1"
        type="text"
        placeholder="Your Message"
        class="w-full overflow-hidden resize-none textarea textarea-bordered"
        bind:this="{inputField}"
        bind:value="{chatmessage}"
        use:init></textarea> -->
      </div>
      <div class="flex flex-row content-end">
        <button
          type="submit"
          class="self-end mb-2 btn btn-primary btn-square"
          on:click="{() => submitChat()}">
          <svg
            class="w-6"
            viewBox="0 0 23 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.5 15L15.5 11M15.5 11L11.5 7M15.5 11H7.5M21.5 11C21.5 16.5228
            17.0228 21 11.5 21C5.97715 21 1.5 16.5228 1.5 11C1.5 5.47715 5.97715
            1 11.5 1C17.0228 1 21.5 5.47715 21.5 11Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"></path>
          </svg>
        </button>
      </div>
    </div>
  {/if}
</div>
