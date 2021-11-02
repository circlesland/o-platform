<script lang="ts">
  import {Continue} from "@o-platform/o-process/dist/events/continue";

  import NotificationViewChatMessage from "./NotificationViewer/atoms/NotificationViewChatMessage.svelte";
  import NotificationViewUbi from "./NotificationViewer/NotificationViewUbi.svelte";
  import NotificationViewTrust from "./NotificationViewer/atoms/NotificationViewTrust.svelte";
  import GenericEventCard from "./GenericEventCard.svelte";
  import NotificationViewTransfer from "./NotificationViewer/atoms/NotificationViewTransfer.svelte";

  import {inbox} from "./stores/inbox";
  import {NotificationViewerContext} from "@o-platform/o-editors/src/notificationViewerContext";
  import ProcessNavigation from "../../../packages/o-editors/src/ProcessNavigation.svelte";
  import {me} from "./stores/me";
  import {setTrust} from "../dapps/o-banking/processes/setTrust";

  export let context: NotificationViewerContext;

  let data: any = context.data[context.field];
  let eventData: any = null;

  const components = [
    {type: "ChatMessage", component: NotificationViewChatMessage},
    {type: "CrcMinting", component: NotificationViewUbi},
    {type: "CrcTrust", component: NotificationViewTrust},
    {type: "CrcHubTransfer", component: NotificationViewTransfer},
  ];

  function submit() {
    const answer = new Continue();
    answer.data = context.data;
    context.process.sendAnswer(answer);
  }

  function buildDataModel(data) {
    console.log("DATA: ", data);
    let notificationType: string = null;
    let title: string = null;

    let type: string = data.type;
    let icon: string = null;
    let limit: number = null;
    let value: string = null;

    let targetCirclesAddress: string = data.payload.from;

    let profile: any;
    let actions: {
      title: string;
      icon: string;
      colorClass: string;
      action: () => void;
    }[] = [];

    switch (data.type) {
      case "ChatMessage":
        notificationType = "chat_message";
        title = `${data.payload.text}`;

        profile = data.payload.from_profile;
        actions = [
          {
            title: "Go to Chat",
            icon: "chat",
            colorClass: "",
            action: () => {
              context.params.push(`#/friends/chat/${data.payload.from}`);
              inbox.acknowledge(data);
            },
          },
        ];
        break;
      case "CrcMinting":
        notificationType = "crc_minting";
        value = data.value;
        actions = [
          {
            title: "Show details",
            icon: "",
            colorClass: "",
            action: () => {
              context.params.push(
                      `#/banking/transactions/${data.transaction_hash}`
              );
              inbox.acknowledge(data);
            },
          },
        ];
        break;
      case "CrcTrust":
        profile = data.payload.can_send_to_profile;
        targetCirclesAddress = data.payload.can_send_to;
        limit = data.payload.limit;

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
                        `#/friends/${
                                data.payload.can_send_to_profile
                                        ? data.payload.can_send_to_profile.circlesAddress
                                        : data.payload.from
                        }`
                );
                // submit(); TODO: ADD BACK IN TO MARK EVENT AS READ
              },
            },
            {
              title: `Untrust ${
                      data.payload.can_send_to_profile
                              ? data.payload.can_send_to_profile.firstName
                              : data.payload.can_send_to
              }`,
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
                        `#/friends/${
                                data.payload.can_send_to_profile
                                        ? data.payload.can_send_to_profile.circlesAddress
                                        : data.payload.can_send_to
                        }`
                );
                // submit(); TODO: ADD BACK IN TO MARK EVENT AS READ
              },
            },
            {
              title: `Trust ${
                      data.payload.can_send_to_profile
                              ? data.payload.can_send_to_profile.firstName
                              : data.payload.can_send_to
              }`,
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
      case "CrcHubTransfer":
        profile = data.payload.from_profile;
        value = data.value;
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
          // {
          //   title: `Send Circles to ${
          //     data.payload.from_profile
          //       ? data.payload.from_profile.firstName
          //       : data.payload.from
          //   }`,
          //   icon: "sendmoney",
          //   colorClass: "",
          //   action: () => {
          //     window.o.runProcess(transfer, {
          //       safeAddress: $me.circlesAddress,
          //       recipientAddress: data.payload.from,
          //       privateKey: localStorage.getItem("circlesKey"),
          //     });
          //   },
          // },
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
      targetCirclesAddress: targetCirclesAddress,
      type: type,
      profile: profile ? profile : null,
      time: data.timestamp,
      fullWidth: true,
      value: value,
      limit: limit,
      notificationType: notificationType,
      title: title,
      icon: icon,
      actions: actions,
      text: text,
    };
  }

  eventData = buildDataModel(data);
  console.log("eventData: ", eventData);

  function handleClick(action) {
    if (action.event) {
      window.o.publishEvent(action.event);
    }
    if (action.action) {
      action.action();
    }
  }

  function getEventView() {
    const specificView = components.find((x) => x.type === eventData.type);

    if (!specificView)
      return {component: GenericEventCard};

    return specificView;
  }
</script>

<div>
  {#if eventData}
    <div class="flex flex-col space-y-4">
      <svelte:component
        this="{getEventView().component}"
        eventData="{eventData}" />
    </div>
  {/if}

  {#if eventData.actions.length > 0}
    <div class="flex flex-row items-center content-center w-full space-x-4">
      <div class="mt-6">
        <button
          on:click="{() => handleClick(eventData.actions[0])}"
          class="h-auto btn-block btn btn-light whitespace-nowrap">
          {eventData.actions[0].title}
        </button>
      </div>
      <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
    </div>
  {:else}
    <ProcessNavigation on:buttonClick="{submit}" context="{context}" />
  {/if}
</div>
