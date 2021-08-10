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

  onMount(() =>
    window.o.publishEvent(<any>{
      type: "shell.scrollToBottom",
      scrollNow: true,
    })
  );

  var eliza = new ElizaBot();
  var initial = eliza.getInitial();

  function submitChat() {
    if (!chatmessage) {
      return;
    }

    addToChatData({
      outgoing: true,
      name: "Jakob Lund",
      time: "just now",
      image:
        "https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/jmnPVI+hYsO421vA/",
      text: chatmessage,
    });

    setTimeout(async () => {
      addToChatData({
        outgoing: false,
        name: "Martin Köppelmann",
        time: "just now",
        image:
          "https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/PP2WbUHmpaCg9Gk7/",
        text: eliza.transform(chatmessage),
      });
      chatmessage = null;
    }, 850);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key == "Enter") {
      submitChat();
    }
  }
</script>

<!-- TODO: fix this after adding data: data-simplebar -->
<div id="chatlist">
  <header class="sticky top-0 z-50 grid w-full bg-white place-content-center">
    <div
      class="flex flex-col items-center self-center w-full m-auto text-center justify-self-center">

      <div class="mt-4 text-3xl tracking-wide uppercase font-heading">
        Herr Meier
      </div>

    </div>
  </header>

  <div class="flex flex-col p-6 space-y-8">
    {#each $chatdata as chat}
      <ChatCard params="{chat}" />
    {/each}
  </div>
  <div
    class="sticky bottom-0 flex flex-row order-1 w-full p-6 space-x-4 bg-white ">
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
        placeholder="message content"
        class="order-1 w-full input input-bordered text-dark"
        style="" />
    </div>
    <div>
      <button
        type="submit"
        class="btn btn-primary btn-square"
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
