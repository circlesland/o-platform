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

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let error: string | undefined = undefined;
let contacts: Contact[] = [];
let shellEventSubscription: Subscription;

async function reload() {
  const safeAddress = $me.circlesAddress;
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const contactsResult = await apiClient.query({
    query: ContactsDocument,
    variables: {
      safeAddress,
    },
  });
  if (contactsResult.errors?.length > 0) {
    error = `Couldn't read the contacts of safe ${safeAddress}: \n${contactsResult.errors
      .map((o) => o.message)
      .join("\n")}`;
    return;
  }
  contacts = contactsResult.data.contacts;
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

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2 mb-14">
  {#if !contacts && !error}
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
    <!-- TODO: Possible actions: trust, transfer money -->

    {#each contacts.filter((o) => !!o.contactAddressProfile) as contact}
      <ChatListCard param="{contact}" />
    {/each}
  {/if}
</div>
