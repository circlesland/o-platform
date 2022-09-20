<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Subscription } from "rxjs";
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import ChatListCard from "../atoms/ChatListCard.svelte";
import { contacts } from "../../../shared/stores/contacts";

import Label from "../../../shared/atoms/Label.svelte";
import { Contact } from "../../../shared/api/data/types";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let error: string | undefined = undefined;
let shellEventSubscription: Subscription;

  let _contacts:Contact[] = [];
  contacts.subscribe(c => {
    console.log("Contacts changed.")
    _contacts = c.filter(o => !o.metadata?.find(o => o.name == "Search"));
  });
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mt-8 mb-20 md:w-2/3 xl:w-1/2">
  {#if !contacts && !error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start ">
          <div><Label key="dapps.o-contacts.pages.chat.loadingConversations" /></div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start ">
          <div>
            <b> <Label key="dapps.o-contacts.pages.chat.error" />{error}</b>
          </div>
        </div>
      </div>
    </section>
  {:else if _contacts}
    {#each _contacts as contact}
      <ChatListCard param="{contact}" />
    {/each}
  {/if}
</div>
