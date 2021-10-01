<script lang="ts">
import ProcessNavigation from "./ProcessNavigation.svelte";
import { Continue } from "@o-platform/o-process/dist/events/continue";
import { NotificationViewerContext } from "./notificationViewerContext";
import Icons from "src/shared/molecules/Icons.svelte";
import NotificationProfile from "./NotificationViewer/atoms/NotificationProfile.svelte";
import DetailActionBar from "src/shared/molecules/DetailActionBar.svelte";
import ChatCard from "src/dapps/o-chat/atoms/ChatCard.svelte";
import { me } from "src/shared/stores/me";
import Web3 from "web3";
import { displayCirclesAmount } from "src/shared/functions/displayCirclesAmount";

export let context: NotificationViewerContext;

let data: any = context.data[context.field];
let eventData: any = null;
const strings = {
  PROFILE_OUTGOING_TRUST_REVOKED: "Trust revoked",
  PROFILE_OUTGOING_TRUST: "Trusted",
  PROFILE_INCOMING_UBI: "Received new income",
  PROFILE_OUTGOING_CIRCLES_TRANSACTION: "Sent money",
};

// TYPES: "chat_message", "crc_trust", "crc_hub_transfer", "crc_minting"

function submit() {
  const answer = new Continue();
  answer.data = context.data;
  context.process.sendAnswer(answer);
}

function onkeydown(e: KeyboardEvent) {
  if (e.key == "Enter") {
    submit();
  }
}

function buildCardModel(data) {
  console.log("DATA: ", data);
  let notificationType: string = null;
  let title: string = null;
  let icon: string = null;
  let outgoing: boolean = data.outgoing;
  let profile: any;
  let actions: {
    title: string;
    icon: string;
    colorClass: string;
    action: () => void;
  }[] = [];

  switch (data.type) {
    case "chat_message":
      notificationType = "chat_message";
      title = `${data.payload.text}`;
      data.safe_address_profile = data.payload.from_profile;
      profile = data.payload.from_profile;
      actions = [
        {
          title: "Go to Chat",
          icon: "chat",
          colorClass: "",
          action: () => {
            context.params.push(`#/chat/${data.payload.from}`);

            // submit(); TODO: ADD BACK IN TO MARK EVENT AS READ
          },
        },
      ];
      break;
    case "crc_minting":
      notificationType = "crc_minting";
      actions = [
        {
          title: "Show details",
          icon: "",
          colorClass: "",
          action: () => {
            context.params.push(
              `#/banking/transactions/${data.transaction_hash}`
            );
            // submit(); TODO: ADD BACK IN TO MARK EVENT AS READ
          },
        },
      ];
      break;

    case "crc_trust":
      data.safe_address_profile = data.payload.can_send_to_profile;
      profile = data.payload.can_send_to_profile;

      if (data.payload.limit == 0) {
        notificationType = "trust_removed";
        icon = "untrust";
        actions = [
          {
            title: "Show Profile",
            icon: "",
            colorClass: "",
            action: () => {
              context.params.push(
                `#/friends/${data.payload.can_send_to_profile.circlesAddress}`
              );
              // submit(); TODO: ADD BACK IN TO MARK EVENT AS READ
            },
          },
          {
            title: `Untrust ${data.payload.can_send_to_profile.firstName}`,
            icon: "untrust",
            colorClass: "",
            action: () => {
              window.o.runProcess(setTrust, {
                trustLimit: 0,
                trustReceiver: data.payload.can_send_to,
                safeAddress: $me.circlesAddress,
                privateKey: localStorage.getItem("circlesKey"),
              });
            },
          },
        ];
      } else if (data.payload.limit > 0) {
        notificationType = "trust_added";

        icon = "trust";
        actions = [
          {
            title: "Show Profile",
            icon: "",
            colorClass: "",
            action: () => {
              context.params.push(
                `#/friends/${data.payload.can_send_to_profile.circlesAddress}`
              );
              // submit(); TODO: ADD BACK IN TO MARK EVENT AS READ
            },
          },
          {
            title: `Trust ${data.payload.can_send_to_profile.firstName}`,
            icon: "trust",
            colorClass: "",
            action: () => {
              window.o.runProcess(setTrust, {
                trustLimit: 100,
                trustReceiver: data.payload.can_send_to,
                safeAddress: $me.circlesAddress,
                privateKey: localStorage.getItem("circlesKey"),
              });
            },
          },
        ];
      }
      break;
    case "crc_hub_transfer":
      profile = data.payload.from_profile;

      notificationType = "transfer_in";
      icon = "sendmoney";

      actions = [
        {
          title: "Show details",
          icon: "",
          colorClass: "",
          action: () => {
            context.params.push(
              `#/banking/transactions/${data.transaction_hash}`
            );
            // submit(); TODO: ADD BACK IN TO MARK EVENT AS READ
          },
        },
        {
          title: `Send Circles to ${data.payload.from_profile.firstName}`,
          icon: "sendmoney",
          colorClass: "",
          action: () => {
            window.o.runProcess(transfer, {
              safeAddress: $me.circlesAddress,
              recipientAddress: data.payload.from,
              privateKey: localStorage.getItem("circlesKey"),
            });
          },
        },
      ];
      break;
  }

  let text = data.tags?.find(
    (o) => o.typeId === "o-banking:transfer:message:1"
  )?.value;
  if (!text) {
    text = "";
  }

  return {
    safeAddress: data.safe_address,
    outgoing: outgoing,
    profile: profile,
    time: data.timestamp / 1000,
    fullWidth: true,
    content: {
      notificationType: notificationType,
      time: data.timestamp / 1000,
      title: title,
      icon: icon,
      actions: actions,
      text: text,
    },
  };
}
eventData = buildCardModel(data);
console.log("eventData: ", eventData);

function handleClick(action) {
  if (action.event) {
    window.o.publishEvent(action.event);
  }
  if (action.action) {
    action.action();
  }
}
</script>

<div>
  {#if context.data[context.field]}
    <div class="flex flex-col space-y-4">
      {#if context.data[context.field].type == "crc_hub_transfer" || context.data[context.field].type == "crc_minting"}
        <div class="self-center text-6xl text-success font-heading">
          +{displayCirclesAmount(context.data[context.field].value)}
          <Icons icon="circlessimple" size="10" />
        </div>
      {/if}
      {#if context.data[context.field].type != "crc_minting"}
        <NotificationProfile profile="{eventData.profile}" />
      {/if}
      {#if context.data[context.field].type == "chat_message"}
        <ChatCard params="{eventData}" />
      {/if}
      {#if context.data[context.field].type == "crc_trust" && context.data[context.field].payload.limit == 0}
        <div class="text-center text-dark-lightest">
          {eventData.profile.firstName} has removed their trust to you.
        </div>
      {/if}
      {#if context.data[context.field].type == "crc_trust" && context.data[context.field].payload.limit != 0}
        {#if eventData.profile.dream}
          <div>
            <div class="text-left text-2xs text-dark-lightest">Passion</div>
            <div class="text-lg">
              {eventData.profile.dream}
            </div>
          </div>
        {/if}
        {#if eventData.mutualFriends}
          <div>
            <div class="text-left text-2xs text-dark-lightest">
              N Mutual Friends ( no data yet )
            </div>
            <div class="flex flex-row space-x-2">
              <div
                class="self-center mt-4 text-center avatar justify-self-center">
                <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
                  <img
                    src="https://circlesland-pictures.fra1.cdn.digitaloceanspaces.com/jmnPVI+hYsO421vA/"
                    alt="avatar" />
                </div>
              </div>
              <div
                class="self-center mt-4 text-center avatar justify-self-center">
                <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
                  <img
                    src="https://images.unsplash.com/photo-1626387691044-2becaea05cc0?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                    alt="avatar" />
                </div>
              </div>
              <div
                class="self-center mt-4 text-center avatar justify-self-center">
                <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
                  <img
                    src="https://images.unsplash.com/photo-1586227740560-8cf2732c1531?ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwzN3x8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                    alt="avatar" />
                </div>
              </div>
              <div
                class="self-center mt-4 text-center avatar justify-self-center">
                <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
                  <img
                    src="https://images.unsplash.com/photo-1626688226927-33257a21236f?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzMXx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                    alt="avatar" />
                </div>
              </div>
              <div
                class="self-center mt-4 text-center avatar justify-self-center">
                <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
                  <img
                    src="https://images.unsplash.com/photo-1626899889787-192a770ba7e7?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0N3x8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                    alt="avatar" />
                </div>
              </div>
              <div
                class="self-center mt-4 text-center avatar justify-self-center">
                <div class="w-10 h-10 mb-4 rounded-full ring ring-white">
                  <img
                    src="https://images.unsplash.com/photo-1621994781204-42a295781499?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0MXx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
                    alt="avatar" />
                </div>
              </div>
            </div>
          </div>
        {/if}
      {/if}
      <div>
        <!-- <DetailActionBar actions="{eventData.content.actions}" /> -->
      </div>
      <pre>
      <!-- {JSON.stringify(context.data[context.field], null, 2)} -->
    </pre>
    </div>
  {/if}

  {#if eventData.content.actions.length > 0}
    <div class="flex flex-row items-center content-center w-full space-x-4">
      <div class="mt-6">
        <button
          on:click="{() => handleClick(eventData.content.actions[0])}"
          class="h-auto btn-block btn btn-light whitespace-nowrap">
          {eventData.content.actions[0].title}
        </button>
      </div>
      <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
    </div>
  {:else}
    <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
  {/if}
</div>
