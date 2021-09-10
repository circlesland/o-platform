<script lang="ts">
  import { setClient } from "svelte-apollo";
  import ContactCard from "../atoms/ContactCard.svelte";
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import CopyClipBoard from "../../../shared/atoms/CopyClipboard.svelte";
  import { me } from "../../../shared/stores/me";
  import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
  import { Routable } from "@o-platform/o-interfaces/dist/routable";
  import Card from "src/shared/atoms/Card.svelte";
  import {Contact, ContactsDocument, TrustRelation} from "../../o-banking/data/api/types";
  import {onMount} from "svelte";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let error:string|undefined = undefined;
  let contacts: Contact[] = [];

  onMount(async () => {
    const safeAddress = $me.circlesAddress;
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const trustResult = await apiClient.query({
      query: ContactsDocument,
      variables: {
        safeAddress
      }
    });
    if (trustResult.errors?.length > 0) {
      error = `Couldn't read the contacts of safe ${safeAddress}: \n${trustResult.errors.map(o => o.message).join("\n")}`;
      return;
    }
    contacts = trustResult.data.contacts;
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
            <b>An error occurred while loading the recent activities:</b>
            <br />
            {error}
          </div>
        </div>
      </div>
    </section>
  {:else}
    {#if contacts.length >= 1}
      <!-- TODO: Possible actions: trust, transfer money -->
      {#each contacts as contact}
        <ContactCard contact={contact} />
      {/each}
    {/if}
  {/if}

</div>
