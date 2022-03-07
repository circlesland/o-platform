<script lang="ts">
  import {onMount} from "svelte";
  import {
    EventType,
    Profile,
    ProfileEvent,
    SendMessageDocument
  } from "../../../shared/api/data/types";
  import {me} from "../../../shared/stores/me";
  import {push} from "svelte-spa-router";
  import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
  import {Subscription} from "rxjs";
  import {contacts} from "../../../shared/stores/contacts";

  import NotificationCard from "../atoms/NotificationCard.svelte";
  import UserImage from "src/shared/atoms/UserImage.svelte";
  import {isMobile} from "../../../shared/functions/isMobile";
  // import * as ECIES from "bitcore-ecies";
  import {_} from "svelte-i18n";
  import EventList from "../../../shared/molecules/Lists/EventList.svelte";
  import {myChats} from "../../../shared/stores/myChat";

  export let id: string;

  let error: string | undefined = undefined;
  let chatHistory: ProfileEvent[] = [];

  let contactProfile: Profile | null;
  let shellEventSubscription: Subscription;

  async function reload() {
    contactProfile = (await contacts.findBySafeAddress(id)).contactAddress_Profile;
  }

  onMount(async () => {
    shellEventSubscription = window.o.events.subscribe(
            async (event: PlatformEvent) => {
              if (event.type != "new_message" && event.type != "blockchain_event") {
                return;
              }
              await reload();
            }
    );
    await reload();

    return () => shellEventSubscription.unsubscribe();
  });

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
      myChats.with(contactProfile.circlesAddress).addToCache(result.data.sendMessage.event);
      myChats.with(contactProfile.circlesAddress).refresh();
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

    await contacts.findBySafeAddress(contactProfile.circlesAddress, true);
  };

  function init(el) {
    el.focus();
  }

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
    push(`#/contacts/profile/${path}`);
  }
</script>

<div id="chatlist">
  <header
    class="sticky top-0 z-50 grid w-full bg-white place-content-center rounded-t-xl">
    <div
      class="relative flex flex-col items-center self-center w-full m-auto text-center justify-self-center">
      {#if contactProfile}
        <div class="absolute " style="left: -56px; top:4px">
          <UserImage
            profile="{contactProfile}"
            size="{10}"
            gradientRing="{true}" />
        </div>
        <div
          class="mt-2 tracking-wide uppercase font-heading"
          class:text-3xl="{!isMobile() ||
            !contactProfile.firstName.startsWith('0x')}"
          class:text-xs="{contactProfile.firstName.startsWith('0x')}">
          {contactProfile.displayName}

          <!-- class:text-3xl="{!isMobile() &&
            !contactProfile.firstName.startsWith('0x')}"
          class:text-xs="{contactProfile.firstName.startsWith('0x')}" -->
        </div>

        <div class="pb-2 text-xs">
          {#if contactProfile.youTrust > 0 && contactProfile.trustsYou > 0}
            {$_("dapps.o-contacts.pages.chatDetail.mutualTrust")}
          {:else if contactProfile.youTrust > 0 && !contactProfile.trustsYou}
            {$_("dapps.o-contacts.pages.chatDetail.youTrust")}
            {contactProfile.contactAddressProfile.firstName}
          {:else if contactProfile.trustsYou > 0}
            {contactProfile.contactAddressProfile.firstName}
            {$_("dapps.o-contacts.pages.chatDetail.trustsYou")}
          {/if}
        </div>
      {/if}
    </div>
  </header>

  <!-- TODO: Add ChatNotificationCard type - check how many we need! -->
  <div class="flex flex-col pb-0 space-y-4 sm:space-y-8">
    {#if contactProfile}
    <EventList
            reverse={true}
            store={myChats.with(contactProfile.circlesAddress)}
            views="{{
              [EventType.CrcHubTransfer]: NotificationCard,
              [EventType.CrcTrust]: NotificationCard,
              [EventType.ChatMessage]: NotificationCard,
              [EventType.Erc20Transfer]: NotificationCard,
              [EventType.Purchased]: NotificationCard,
              [EventType.SaleEvent]: NotificationCard,
              [EventType.InvitationRedeemed]: NotificationCard
    }}" />
    {/if}
  </div>
  {#if contactProfile && contactProfile.id > -1}
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
          placeholder="{$_('dapps.o-contacts.pages.chatDetail.placeholder')}"
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
