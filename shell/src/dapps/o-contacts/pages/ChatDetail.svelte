<script lang="ts">
import { onDestroy, onMount } from "svelte";
import ChatCard from "../atoms/ChatCard.svelte";
import NotificationCard from "../atoms/NotificationCard.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import {
  ChatHistoryDocument,
  Contact,
  ContactDocument,
  ProfileEvent,
  SendMessageDocument,
} from "../../../shared/api/data/types";
import { me } from "../../../shared/stores/me";
import { RpcGateway } from "@o-platform/o-circles/dist/rpcGateway";
import UserImage from "src/shared/atoms/UserImage.svelte";
import { setTrust } from "../../o-banking/processes/setTrust";
import { transfer } from "../../o-banking/processes/transfer";
import { push } from "svelte-spa-router";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import { displayCirclesAmount } from "../../../shared/functions/displayCirclesAmount";

export let id: string;

let error: string | undefined = undefined;
let chatHistory: ProfileEvent[] = [];

let contactProfile: Contact | null;
let shellEventSubscription: Subscription;

async function reload() {
  const safeAddress = $me.circlesAddress;
  const contactSafeAddress = id;
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const chatHistoryResultPromise = apiClient.query({
    query: ChatHistoryDocument,
    variables: {
      safeAddress,
      contactSafeAddress,
    },
  });
  const contactProfileResultPromise = apiClient.query({
    query: ContactDocument,
    variables: {
      safeAddress: $me.circlesAddress.toLowerCase(),
      contactAddress: id,
    },
  });

  const apiResults = await Promise.all([
    chatHistoryResultPromise,
    contactProfileResultPromise,
  ]);
  const chatHistoryResult = apiResults[0];
  const contactProfileResult = apiResults[1];
  if (apiResults.filter((o) => o.errors?.length > 0).length > 0) {
    error = `Couldn't read the chatHistory or the profile of safe ${safeAddress}`;
    return;
  }
  chatHistory = chatHistoryResult.data.chatHistory;
  contactProfile = contactProfileResult.data.contact
    ? contactProfileResult.data.contact
    : null;

  console.log("PRFILE: ", contactProfile);

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
  const result = await apiClient.mutate({
    mutation: SendMessageDocument,
    variables: {
      toSafeAddress: id,
      content: text,
    },
  });

  if (result.data?.sendMessage?.success) {
    chatHistory = [...chatHistory, result.data.sendMessage.event];
  }

  window.o.publishEvent(<any>{
    type: "shell.scrollToBottom",
    scrollNow: true,
  });
};

function init(el) {
  el.focus();
}

var autoExpand = function () {
  var el = this;
  setTimeout(function () {
    el.style.cssText = "height:auto; padding:0 padding-top: 2px;";
    el.style.cssText = "height:" + el.scrollHeight + "px";
  }, 0);
};

var resetAutoExpand = function () {
  var el = this;
  setTimeout(function () {
    el.style.cssText = "height:auto; padding:0 padding-top: 2px;";
  }, 0);
};

onMount(() => {
  window.o.publishEvent(<any>{
    type: "shell.scrollToBottom",
    scrollNow: true,
  });
  // let textarea = document.querySelector("textarea");
  // textarea.addEventListener("input", autoExpand);
  // let detectedDevice = uaParser.getDevice();
  // if (length > 17) {
  //   textarea.dispatchEvent(new Event("input"));
  // }
  // if (detectedDevice && detectedDevice.type) {
  //   if (detectedDevice.type != "mobile") {
  //     inputField.focus();
  //   }
  // } else {
  //   inputField.focus();
  // }
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

function buildCardModel(chat) {
  // console.log("CHAT: ", chat);
  let notificationType: string = null;
  let title: string = null;
  let icon: string = null;
  let outgoing: boolean = chat.safeAddress === $me.circlesAddress;
  let actions: {
    title: string;
    icon: string;
    colorClass: string;
    action: () => void;
  }[] = [];

  switch (chat.type) {
    case "chat_message":
      notificationType = "chat_message";
      title = `${chat.payload.text}`;
      outgoing = chat.payload.from !== $me.circlesAddress.toLowerCase();
      chat.safe_address_profile = chat.payload.from_profile;
      break;
    case "crc_trust":
      if (chat.payload.limit == 0 && chat.safe_address == $me.circlesAddress) {
        notificationType = "trust_removed";
        title = `You untrusted ${
          chat.payload.address_profile
            ? chat.payload.address_profile.firstName
            : ""
        }`;
        icon = "untrust";
        actions = contactProfile
          ? !contactProfile.youTrust
            ? [
                {
                  title: `Trust ${
                    chat.payload.address_profile
                      ? chat.payload.address_profile.firstName
                      : ""
                  }`,
                  icon: "trust",
                  colorClass: "",
                  action: () => {
                    window.o.runProcess(setTrust, {
                      trustLimit: 100,
                      trustReceiver: chat.payload.address,
                      safeAddress: $me.circlesAddress,
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
            : []
          : [];
      } else if (
        chat.payload.limit > 0 &&
        chat.safe_address === $me.circlesAddress
      ) {
        notificationType = "trust_added";
        title = `You trusted ${
          chat.payload.address_profile
            ? chat.payload.address_profile.firstName
            : ""
        }`;
        icon = "trust";
        actions = contactProfile
          ? contactProfile.youTrust > 0
            ? [
                {
                  title: `Untrust ${
                    chat.payload.address_profile
                      ? chat.payload.address_profile.firstName
                      : ""
                  }`,
                  icon: "untrust",
                  colorClass: "",
                  action: () => {
                    window.o.runProcess(setTrust, {
                      trustLimit: 0,
                      trustReceiver: chat.payload.address,
                      safeAddress: $me.circlesAddress,
                      privateKey: sessionStorage.getItem("circlesKey"),
                    });
                  },
                },
              ]
            : []
          : [];
      } else if (
        chat.payload.limit === 0 &&
        chat.safe_address !== $me.circlesAddress
      ) {
        notificationType = "trust_removed";
        title = `${chat.payload.can_send_to_profile.firstName} untrusted you`;
        icon = "untrust";
        outgoing = chat.safeAddress !== $me.circlesAddress;
      } else if (
        chat.payload.limit > 0 &&
        chat.safe_address !== $me.circlesAddress
      ) {
        notificationType = "trust_added";
        title = `${chat.payload.can_send_to_profile.firstName} trusted you`;
        icon = "trust";
        outgoing = chat.safeAddress !== $me.circlesAddress;
        actions = contactProfile
          ? (!contactProfile.youTrust
              ? [
                  {
                    title: `Trust ${chat.payload.can_send_to_profile.firstName}`,
                    icon: "trust",
                    colorClass: "",
                    action: () => {
                      window.o.runProcess(setTrust, {
                        trustLimit: 100,
                        trustReceiver: chat.payload.can_send_to,
                        safeAddress: $me.circlesAddress,
                        privateKey: sessionStorage.getItem("circlesKey"),
                      });
                    },
                  },
                ]
              : []
            ).concat(
              contactProfile.trustsYou
                ? [
                    {
                      title: `Send Circles to ${chat.payload.can_send_to_profile.firstName}`,
                      icon: "sendmoney",
                      colorClass: "",
                      action: () => {
                        window.o.runProcess(transfer, {
                          safeAddress: $me.circlesAddress,
                          recipientAddress: chat.payload.can_send_to,
                          privateKey: sessionStorage.getItem("circlesKey"),
                        });
                      },
                    },
                  ]
                : []
            )
          : [];
      }
      break;
    case "crc_hub_transfer":
      if (chat.payload.to_profile && chat.safe_address === $me.circlesAddress) {
        notificationType = "transfer_out";
        icon = "sendmoney";
        (title = `You sent ${displayCirclesAmount(
          chat.value,
          null,
          true,
          $me.displayTimeCircles || $me.displayTimeCircles === undefined
        )} Circles to ${chat.payload.to_profile.firstName}`),
          (actions = []);
      } else if (
        chat.payload.from_profile &&
        chat.safe_address !== $me.circlesAddress
      ) {
        outgoing = chat.safeAddress !== $me.circlesAddress;
        notificationType = "transfer_in";
        icon = "sendmoney";
        title = `${
          chat.payload.from_profile.firstName
        } sent you ${displayCirclesAmount(
          chat.value,
          null,
          true,
          $me.displayTimeCircles || $me.displayTimeCircles === undefined
        )} Circles`;
        actions = contactProfile
          ? (!contactProfile.youTrust
              ? [
                  {
                    title: `Trust ${chat.payload.from_profile.firstName}`,
                    icon: "trust",
                    colorClass: "",
                    action: () => {
                      window.o.runProcess(setTrust, {
                        trustLimit: 100,
                        trustReceiver: chat.payload.from,
                        safeAddress: $me.circlesAddress,
                        privateKey: sessionStorage.getItem("circlesKey"),
                      });
                    },
                  },
                ]
              : []
            ).concat({
              title: `Send Circles to ${chat.payload.from_profile.firstName}`,
              icon: "sendmoney",
              colorClass: "",
              action: () => {
                window.o.runProcess(transfer, {
                  safeAddress: $me.circlesAddress,
                  recipientAddress: chat.payload.from,
                  privateKey: sessionStorage.getItem("circlesKey"),
                });
              },
            })
          : [];
      }
      break;
  }

  let text = chat.tags?.find(
    (o) => o.typeId === "o-banking:transfer:message:1"
  )?.value;
  if (!text) {
    text = "";
  }

  return {
    safeAddress: chat.safe_address,
    outgoing: outgoing,
    name: chat.safe_address_profile.firstName,
    time: chat.timestamp,
    content: {
      notificationType: notificationType,
      time: chat.timestamp,
      title: title,
      icon: icon,
      actions: actions,
      text: text,
    },
  };
}
</script>

<div id="chatlist">
  <header class="sticky top-0 z-50 grid w-full bg-white place-content-center">
    <div
      class="relative flex flex-col items-center self-center w-full m-auto text-center justify-self-center">
      <div class="absolute " style="left: -56px; top:4px">
        {#if contactProfile}
          <UserImage
            profile="{contactProfile.contactAddressProfile}"
            size="{10}"
            gradientRing="{true}" />
        {/if}
      </div>
      <div class="mt-2 text-3xl tracking-wide uppercase font-heading">
        {#if contactProfile}
          {#if contactProfile.contactAddressProfile}
            {contactProfile.contactAddressProfile.firstName}
            {contactProfile.contactAddressProfile.lastName
              ? contactProfile.contactAddressProfile.lastName
              : ""}
          {/if}
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
    {#each chatHistory as chat}
      {#if chat.type === "chat_message"}
        <ChatCard params="{buildCardModel(chat)}" />
      {:else}
        <NotificationCard params="{buildCardModel(chat)}" />
      {/if}
    {/each}
  </div>
  <div
    class:hidden="{!contactProfile ||
      !contactProfile.contactAddressProfile ||
      !contactProfile.contactAddressProfile.id}"
    class="sticky bottom-0 flex flex-row order-1 w-full p-2 pb-0 space-x-4 bg-white sm:p-6 sm:pt-2">
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
</div>
