<script lang="ts">
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {Organisation, OrganisationsDocument} from "../../../shared/api/data/types";
  import SimpleHeader from "../../../shared/atoms/SimpleHeader.svelte";
  import {onMount} from "svelte";
  import OrganisationCard from "../atoms/OrganisationCard.svelte";

  let organisations: Organisation[] = null;
  let error: string | undefined = undefined;

  export let runtimeDapp: RuntimeDapp<any>;
  export let routable: Routable;

  async function reload() {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
      query: OrganisationsDocument
    });
    if (result.errors?.length > 0) {
      error = `Couldn't read the organisations`;
      return;
    }
    organisations = result.data.organisations;
  }

  onMount(async () => {
    await reload();
  });
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2 mb-14">
  {#if !organisations && !error}
    <section class="flex items-center justify-center mb-2 ">
      <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
        <div class="flex flex-col items-start">
          <div>Loading organisations...</div>
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
    {#each organisations as organisation}
      <OrganisationCard organisation={organisation} />
    {/each}
  {/if}
</div>
