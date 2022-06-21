<script lang="ts">
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Subscription } from "rxjs";
import SimpleHeader from "@shared/atoms/SimpleHeader.svelte";
import ChatListCard from "../atoms/ChatListCard.svelte";
import { contacts } from "../../../shared/stores/contacts";

import { _ } from "svelte-i18n";
import { Contact } from "../../../shared/api/data/types";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let error: string | undefined = undefined;
let shellEventSubscription: Subscription;

let _contacts: Contact[] = [];
contacts.subscribe((c) => {
  console.log("Contacts changed.");
  _contacts = c;
});
</script>

SimpleHeader(runtimeDapp="{runtimeDapp}" routable="{routable}")

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  {#if !contacts && !error}
    <section class="flex items-center justify-center mb-">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow">
        <div class="flex flex-col items-">
          <div>
            {$_("dapps.o-contacts.pages.chat.loadingConversations")}
          </div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow">
        <div class="flex flex-col items-">
          <div>
            <b>{$_("dapps.o-contacts.pages.chat.error")}</b>
            <br />{error}
          </div>
        </div>
      </div>
    </section>
  {:else if _contacts}
    {#each _contacts as contact}
      ChatListCard(param="{contact}")
    {/each}
  {/if}
</div>
