<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import {me} from "../../../shared/stores/me";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {onDestroy, onMount} from "svelte";
  import {
    AggregatesDocument,
    AggregateType,
    ContactPoint, EventType,
  } from "../../../shared/api/data/types";
  import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
  import {Subscription} from "rxjs";
  import ContactCard2 from "../atoms/ContactCard2.svelte";
  import {ZERO_ADDRESS} from "@o-platform/o-circles/dist/consts";

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  let error: string | undefined = undefined;
  let contacts: ContactPoint[] = [];

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

    const contactsList:ContactPoint[] = c.data.aggregates[0].payload.contacts;

    let trustedContacts = contactsList.filter(o => {
      // Check if the contact trusted me or if I trusted the contact
      const crcTrust = o.metadata.find(p => p.name === EventType.CrcTrust);
      if (!crcTrust) {
        return false;
      }

      // Check if the contact still trusts me or if I still trust the contact
      return crcTrust.directions.find((o, i) => parseInt(crcTrust.values[i]) > 0);
    });

    // Filter my own address and the UBI minting address
    trustedContacts = trustedContacts.filter(o => o.contactAddress != safeAddress
                                              && o.contactAddress != ZERO_ADDRESS);

    contacts = trustedContacts.sort((a,b) => {
      // Contacts without profile should be sorted to the bottom
      if (a.contactAddress_Profile.firstName.startsWith("0x"))
        return 1;
      if (b.contactAddress_Profile.firstName.startsWith("0x"))
        return -1;

      // All others alphabetically
      return (a.contactAddress_Profile.firstName + a.contactAddress_Profile.lastName).localeCompare(
              b.contactAddress_Profile.firstName + b.contactAddress_Profile.lastName
      )
    });
  }

  let shellEventSubscription: Subscription;
  onMount(async () => {
    shellEventSubscription = window.o.events.subscribe(
            async (event: PlatformEvent) => {
              if (event.type != "shell.refresh" || (<any>event).dapp != "contacts:1") {
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

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
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
    {#each contacts.sort(o => o.contactAddress_Profile.f) as contact}
      <!--<ContactCard contact="{contact}" />-->
      <ContactCard2 contact="{contact}" />
    {/each}
  {/if}
</div>
