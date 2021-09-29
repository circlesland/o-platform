<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import { me } from "../../../shared/stores/me";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import { onMount } from "svelte";
  import { Contact, ContactsDocument } from "../../../shared/api/data/types";
  import ContactCard from "../../o-chat/atoms/ContactCard.svelte";
  import { AvataarGenerator } from "../../../shared/avataarGenerator";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let error: string | undefined = undefined;
  let contacts: Contact[] = [];

  onMount(async () => {
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
        .map(o => o.message)
        .join("\n")}`;
      return;
    }
    contacts = contactsResult.data.contacts
      .filter(o => {
        return o.contactAddressProfile && (o.trustsYou || o.youTrust);
      })
      .sort((a, b) => {
        if (!a.contactAddressProfile && !b.contactAddressProfile) {
          return 0;
        }
        if (a.contactAddressProfile && !b.contactAddressProfile) {
          return 1;
        }
        if (!a.contactAddressProfile && b.contactAddressProfile) {
          return -1;
        }

        const displayName_a = `${a.contactAddressProfile.firstName} ${a.contactAddressProfile.lastName}`;
        const displayName_b = `${b.contactAddressProfile.firstName} ${b.contactAddressProfile.lastName}`;
        return displayName_a.localeCompare(displayName_b);
      });
  });
</script>

<SimpleHeader {runtimeDapp} {routable} />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2">
  {#if !contacts && !error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading contacts...</div>
        </div>
      </div>
    </section>
  {:else if error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>
            <b>An error occurred while loading your contacts:</b>
            <br />
            {error}
          </div>
        </div>
      </div>
    </section>
  {:else}
    <!-- TODO: Possible actions: trust, transfer money -->
    {#each contacts.filter(o => !!o.contactAddressProfile) as contact}
      <ContactCard {contact} />
    {/each}
  {/if}
</div>
