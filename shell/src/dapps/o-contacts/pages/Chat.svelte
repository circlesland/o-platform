<script lang="ts">
  import {me} from "../../../shared/stores/me";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {onDestroy, onMount} from "svelte";
  import {
    AggregatesDocument,
    AggregateType, Contact
  } from "../../../shared/api/data/types";
  import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
  import {Subscription} from "rxjs";
  import {ZERO_ADDRESS} from "@o-platform/o-circles/dist/consts";
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import ChatListCard from "../atoms/ChatListCard.svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let error: string | undefined = undefined;
  let contacts: Contact[] = [];
  let shellEventSubscription: Subscription;

  async function reload() {
    const safeAddress = $me.circlesAddress.toLowerCase();
    const apiClient = await window.o.apiClient.client.subscribeToResult();

    const c = await apiClient.query({
      query: AggregatesDocument,
      variables: {
        types: [AggregateType.Contacts],
        safeAddress: safeAddress
      }
    });

    if (c.errors?.length > 0) {
      error = `Couldn't read the contacts of safe ${safeAddress}: \n${c.errors
              .map((o) => o.message)
              .join("\n")}`;
      return;
    }

    const contactsList:Contact[] = c.data.aggregates[0].payload.contacts.filter((o:Contact) => {
      return o.contactAddress !== ZERO_ADDRESS && o.contactAddress != safeAddress;
    });
    contacts = contactsList.sort((a,b) => a.lastContactAt > b.lastContactAt ? -1 :a.lastContactAt < b.lastContactAt ? 1 :0);
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
</script>
<!--
<List limit="{100}"
      queryArguments="{{
          safeAddress: $me.circlesAddress,
          types: [
            EventType.ChatMessage
          ]
        }}"
      views={{
          [EventType.ChatMessage]: ChatListCard
        }} />
-->
<template lang="pug">
  
SimpleHeader(runtimeDapp="{runtimeDapp}" routable="{routable}")

div.px-4.mx-auto.-mt-3.mb-20(class='md:w-2/3 xl:w-1/2')
  +if('!contacts && !error')
    section.flex.items-center.justify-center.mb-2
      div.flex.items-center.w-full.p-4.space-x-2.bg-white.shadow
        div.flex.flex-col.items-start
          div Loading conversations...
    +elseif('error')
      section.flex.items-center.justify-center.mb-2
        div.flex.items-center.w-full.p-4.space-x-2.bg-white.shadow
          div.flex.flex-col.items-start
            div
              b An error occurred while loading the recent activities:
              | {error}
    +else
      +if('contacts')
        +each(`contacts as contact(contact.contactAddress + contact.lastContactAt)`)
          ChatListCard(param="{contact}")

</template>
