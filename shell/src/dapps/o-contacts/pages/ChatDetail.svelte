<script lang="ts">
  import { onDestroy, onMount, setContext } from "svelte";
  import { Subscription } from "rxjs";
  import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
  import ElizaBot from "elizabot";

  import { chatdata } from "../data/api/src/chatstore";
  import ChatCard from "../atoms/ChatCard.svelte";
  import "simplebar";
  import "simplebar/dist/simplebar.css";

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

  var autoExpand = function() {
    var el = this;
    setTimeout(function() {
      el.style.cssText = "height:auto; padding:0 padding-top: 2px;";
      el.style.cssText = "height:" + el.scrollHeight + "px";
    }, 0);
  };

  var resetAutoExpand = function() {
    var el = this;
    setTimeout(function() {
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
</script>

<div id="chatlist">
  <header class="sticky top-0 z-50 grid w-full bg-white place-content-center">
    <div
      class="relative flex flex-col items-center self-center w-full m-auto text-center justify-self-center">
      <div class="absolute avatar " style="left: -56px; top:9px">
        <div class="w-8 h-8 m-auto rounded-full ">
          <img
            src="https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/PP2WbUHmpaCg9Gk7/"
            alt="user-icon" />
        </div>
      </div>
      <div class="mt-2 text-3xl tracking-wide uppercase font-heading">
        Martin Köppelmann
      </div>

    </div>
  </header>

  <!-- TODO: Add ChatNotificationCard type - check how many we need! -->
  <div class="flex flex-col p-2 pb-0 space-y-4 sm:p-6 sm:space-y-8">
    {#each $chatdata as chat}
      <ChatCard params="{chat}" />
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
