<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { onDestroy, onMount } from "svelte";
import { Contact, ContactsDocument } from "../../../shared/api/data/types";
import ChatListCard from "../atoms/ChatListCard.svelte";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { Subscription } from "rxjs";
import List from "../../../shared/molecules/Lists/List.svelte";

import {EventType} from "../../../shared/api/data/types";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let error: string | undefined = undefined;
let contacts: Contact[] = [];
// let shellEventSubscription: Subscription;

// onMount(async () => {
//   shellEventSubscription = window.o.events.subscribe(
//       async (event: PlatformEvent) => {
//         if (event.type != "shell.refresh" || (<any>event).dapp != "chat:1") {
//           return;
//         }
//         await reload();
//       }
//   );
//   await reload();
// });

// onDestroy(() => shellEventSubscription.unsubscribe());

const listArguments = {
  safeAddress: $me.circlesAddress,
  limit: 20,
};
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">
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
  <!--
  <List
    listItemComponent="{ChatListCard}"
    fetchQuery="{ContactsDocument}"
    fetchQueryArguments="{listArguments}"
    dataKey="contacts" />
  -->
  <!-- {#if !contacts && !error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading conversations...</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading the recent activities:</b>
            <br />
            {error}
          </div>
        </div>
      </div>
    </section>
  {:else}
    
    {#each contacts.filter(o => !!o.contactAddressProfile) as contact}
      <ChatListCard {contact} />
    {/each}
  {/if} -->
</div>
