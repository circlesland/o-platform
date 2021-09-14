<script lang="ts">
  import {onMount} from "svelte";
  import ElizaBot from "elizabot";

  import {chatdata} from "../data/api/src/chatstore";
  import ChatCard from "../atoms/ChatCard.svelte";
  import "simplebar";
  import "simplebar/dist/simplebar.css";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {
    ChatHistoryDocument, Contact, ContactDocument
  } from "../../../shared/api/data/types";
  import {me} from "../../../shared/stores/me";
  import {ProfileEvent} from "../data/api/types";
  import {RpcGateway} from "@o-platform/o-circles/dist/rpcGateway";
  import {AvataarGenerator} from "../../../shared/avataarGenerator";
  import {setTrust} from "../../o-banking/processes/setTrust";
  import {transfer} from "../../o-banking/processes/transfer";
  import {retry} from "rxjs/operators";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;
  export let id: string;

  let error: string | undefined = undefined;
  let chatHistory: ProfileEvent[] = [];

  let contactProfile: Contact | null;

  onMount(async () => {
    const safeAddress = $me.circlesAddress;
    const contactSafeAddress = id;
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const chatHistoryResultPromise = apiClient.query({
      query: ChatHistoryDocument,
      variables: {
        safeAddress,
        contactSafeAddress
      }
    });
    const contactProfileResultPromise = apiClient.query({
      query: ContactDocument,
      variables: {
        safeAddress: $me.circlesAddress.toLowerCase(),
        contactAddress: id,
      }
    });

    const apiResults = await Promise.all([chatHistoryResultPromise, contactProfileResultPromise]);
    const chatHistoryResult = apiResults[0];
    const contactProfileResult = apiResults[1];
    if (apiResults.filter(o => o.errors?.length > 0).length > 0) {
      error = `Couldn't read the chatHistory or the profile of safe ${safeAddress}`;
      return;
    }
    chatHistory = chatHistoryResult.data.chatHistory;
    contactProfile = contactProfileResult.data.contact ? contactProfileResult.data.contact : null;

    window.o.publishEvent(<any>{
      type: "shell.scrollToBottom",
      scrollNow: true,
    });
  });

  let inputField: any;
  let chatmessage: string;

  const addToChatData = chatdetails => {
    $chatdata = [...$chatdata, chatdetails];

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
    let textarea = document.querySelector("textarea");
    textarea.addEventListener("input", autoExpand);
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

  var eliza = new ElizaBot();
  var initial = eliza.getInitial();

  function submitChat() {
    if (!chatmessage) {
      return;
    }
    let elizamesssage = eliza.transform(chatmessage);

    addToChatData({
      outgoing: true,
      name: "Jakob Lund",
      time: "just now",
      image:
        "https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/jmnPVI+hYsO421vA/",
      text: chatmessage,
    });

    chatmessage = null;
    let textarea = document.querySelector("textarea");
    textarea.style.cssText = "height:auto; padding:0 padding-top: 2px;";

    setTimeout(async () => {
      addToChatData({
        outgoing: false,
        name: "Martin Köppelmann",
        time: "just now",
        image:
          "https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/PP2WbUHmpaCg9Gk7/",
        text: elizamesssage,
      });
    }, 850);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      submitChat();
    }
  }

  function buildCardModel(chat) {
    let notificationType: string = null;
    let title: string = null;
    let outgoing: boolean = chat.safeAddress === $me.circlesAddress;
    let actions: {
      title: string,
      icon: string,
      colorClass: string,
      action: () => void
    }[] = [];

    switch (chat.type) {
      case "crc_trust":
        if (chat.payload.limit == 0 && chat.safe_address == $me.circlesAddress) {
          notificationType = "trust_removed";
          title = `You untrusted ${chat.payload.address_profile.firstName}`;
          actions = !contactProfile.youTrust
            ? [{
              title: `Trust ${chat.payload.address_profile.firstName}`,
              icon: "",
              colorClass: "",
              action: () => {
                window.o.runProcess(setTrust, {
                  trustLimit: 100,
                  trustReceiver: chat.payload.address,
                  safeAddress: $me.circlesAddress,
                  privateKey: localStorage.getItem("circlesKey"),
                });
              }
            }]
            : []
        } else if (chat.payload.limit > 0 && chat.safe_address === $me.circlesAddress) {
          notificationType = "trust_added";
          title = `You trusted ${chat.payload.address_profile.firstName}`;
          actions = contactProfile.youTrust > 0 ? [{
              title: `Untrust ${chat.payload.address_profile.firstName}`,
              icon: "",
              colorClass: "",
              action: () => {
                window.o.runProcess(setTrust, {
                  trustLimit: 0,
                  trustReceiver: chat.payload.address,
                  safeAddress: $me.circlesAddress,
                  privateKey: localStorage.getItem("circlesKey"),
                });
              }
            }]
            : [];
        } else if (chat.payload.limit === 0 && chat.safe_address !== $me.circlesAddress) {
          notificationType = "trust_removed";
          title = `${chat.payload.can_send_to_profile.firstName} untrusted you`;
          outgoing = chat.safeAddress !== $me.circlesAddress;
        } else if (chat.payload.limit > 0 && chat.safe_address !== $me.circlesAddress) {
          notificationType = "trust_added";
          title = `${chat.payload.can_send_to_profile.firstName} trusted you`;
          outgoing = chat.safeAddress !== $me.circlesAddress;
          actions = (!contactProfile.youTrust ? [{
            title: `Trust ${chat.payload.can_send_to_profile.firstName}`,
            icon: "",
            colorClass: "",
            action: () => {
              window.o.runProcess(setTrust, {
                trustLimit: 100,
                trustReceiver: chat.payload.can_send_to,
                safeAddress: $me.circlesAddress,
                privateKey: localStorage.getItem("circlesKey"),
              });
            }
          }] : []).concat(contactProfile.trustsYou ? [{
            title: `Send Circles to ${chat.payload.can_send_to_profile.firstName}`,
            icon: "",
            colorClass: "",
            action: () => {
              window.o.runProcess(transfer, {
                safeAddress: $me.circlesAddress,
                recipientAddress: chat.payload.can_send_to,
                privateKey: localStorage.getItem("circlesKey"),
              });
            }
          }] : []);
        }
        break;
      case "crc_hub_transfer":
        if (chat.safe_address === $me.circlesAddress) {
          notificationType = "transfer_out";
          title = `You sent ${RpcGateway.get().utils.fromWei(chat.value, "ether")} CRC to ${chat.payload.to_profile.firstName}`,
          actions = [];
        } else if (chat.safe_address !== $me.circlesAddress) {
          outgoing = chat.safeAddress !== $me.circlesAddress;
          notificationType = "transfer_in";
          title = `${chat.payload.from_profile.firstName} sent you ${RpcGateway.get().utils.fromWei(chat.value, "ether")} CRC`
          actions = (!contactProfile.youTrust ? [{
              title: `Trust ${chat.payload.from_profile.firstName}`,
              icon: "",
              colorClass: "",
              action: () => {
                window.o.runProcess(setTrust, {
                  trustLimit: 100,
                  trustReceiver: chat.payload.from,
                  safeAddress: $me.circlesAddress,
                  privateKey: localStorage.getItem("circlesKey"),
                });
              }
            }]
            : []).concat({
            title: `Send Circles to ${chat.payload.from_profile.firstName}`,
            icon: "",
            colorClass: "",
            action: () => {
              window.o.runProcess(transfer, {
                safeAddress: $me.circlesAddress,
                recipientAddress: chat.payload.from,
                privateKey: localStorage.getItem("circlesKey"),
              });
            }
          });
        }
        break;
    }

    let text = chat.tags?.find(o => o.typeId === "o-banking:transfer:message:1")?.value;
    if (!text) {
      text = "";
    }

    return {
      safeAddress: chat.safe_address,
      outgoing: outgoing,
      name: chat.safe_address_profile.firstName,
      time: chat.timestamp / 1000,
      content: {
        notificationType: notificationType,
        time: chat.timestamp / 1000,
        title: title,
        actions: actions,
        text: text
      },
      image: chat.safe_address_profile.avatarUrl
        ? chat.safe_address_profile.avatarUrl
        : AvataarGenerator.generate(chat.safe_address),
    };
  }
</script>

<div id="chatlist">
    <header class="sticky top-0 z-50 grid w-full bg-white place-content-center">
        <div
                class="relative flex flex-col items-center self-center w-full m-auto text-center justify-self-center">
            <!--
            <div class="absolute avatar " style="left: -56px; top:9px">
              <div class="w-8 h-8 m-auto rounded-full ">

                {#if contactProfile}
                  <img
                          src={contactProfile.avatarUrl ? contactProfile.avatarUrl : AvataarGenerator.generate(contactProfile.circlesAddress)}
                          alt="user-icon" />
                {/if}
              </div>
            </div>-->
            <div class="mt-2 text-3xl tracking-wide uppercase font-heading">
                {#if contactProfile}
                    {#if contactProfile.contactAddressProfile}
                        {contactProfile.contactAddressProfile.firstName} {contactProfile.contactAddressProfile.lastName}
                    {/if}
                {/if}
            </div>

            {#if contactProfile}
                {#if contactProfile.youTrust > 0 && contactProfile.trustsYou > 0}
                    Mutual trust
                {:else if contactProfile.youTrust > 0 && !contactProfile.trustsYou}
                    You trust {contactProfile.contactAddressProfile.firstName}
                {:else if contactProfile.trustsYou > 0}
                    {contactProfile.contactAddressProfile.firstName} trusts you
                {/if}
            {/if}

        </div>
    </header>

    <!-- TODO: Add ChatNotificationCard type - check how many we need! -->
    <div class="flex flex-col p-2 pb-0 space-y-4 sm:p-6 sm:space-y-8">
        {#each chatHistory as chat}
            <ChatCard params={buildCardModel(chat)}/>
        {/each}
    </div>
    <div
            class="sticky bottom-0 flex flex-row order-1 w-full p-2 pb-0 space-x-4 bg-white sm:p-6 sm:pt-2">
        <div class="flex-grow">
            <!-- <input
              bind:this="{inputField}"
              on:keydown="{onkeydown}"
              bind:value="{chatmessage}"
              use:init
              type="text"
              name="searchTerm"
              autocomplete="off"
              autocorrect="off"
              spellcheck="false"
              placeholder="message content"
              class="order-1 w-full input input-bordered text-dark"
              style="" /> -->
            <textarea
                    name="searchTerm"
                    rows="1"
                    type="text"
                    placeholder="Your Message"
                    class="w-full overflow-hidden resize-none textarea textarea-bordered"
                    bind:this="{inputField}"
                    bind:value="{chatmessage}"
                    use:init></textarea>
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
