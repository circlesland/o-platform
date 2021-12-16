<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import ContactCard from "../atoms/ContactCard.svelte";
import { contacts } from "../../../shared/stores/contacts";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

function sortAlphabetically(a, b) {
  if (a.contactAddress_Profile.firstName.startsWith("0x")) {
    return 1;
  }
  if (b.contactAddress_Profile.firstName.startsWith("0x")) {
    return -1;
  }
  return a.contactAddress_Profile.firstName.localeCompare(
    b.contactAddress_Profile.firstName
  );
}
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto mb-20 -mt-3 md:w-2/3 xl:w-1/2">
  {#if $contacts.length === 0}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading contacts...</div>
        </div>
      </div>
    </section>
  {:else}
    <!-- TODO: Possible actions: trust, transfer money -->

    {#each [...$contacts].sort(sortAlphabetically) as contact}
      <!--<ContactCard contact="{contact}" />-->
      <ContactCard contact="{contact}" />
    {/each}
  {/if}
</div>
