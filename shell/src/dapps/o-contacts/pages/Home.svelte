<script lang="ts">
  import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
  import {RuntimeDapp} from "@o-platform/o-interfaces/dist/runtimeDapp";
  import {Routable} from "@o-platform/o-interfaces/dist/routable";
  import {onMount} from "svelte";
  import {inbox} from "../../../shared/stores/inbox";

  export let runtimeDapp:RuntimeDapp<any>;
  export let routable:Routable;

  onMount(() => {

  });

</script>

<SimpleHeader {runtimeDapp} {routable}  />

<div class="mx-auto -mt-3 md:w-2/3 xl:w-1/2">
    {#each $inbox as event}
    <section class="flex items-center justify-center mb-2 ">
        <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
            <div class="flex flex-col items-start">
                <div>
                    {#if event.type === "PROFILE_INCOMING_UBI"}
                        PROFILE_INCOMING_UBI
                    {:else if event.type === "PROFILE_INCOMING_CIRCLES_TRANSACTION"}
                        PROFILE_INCOMING_CIRCLES_TRANSACTION
                    {:else if event.type === "PROFILE_OUTGOING_CIRCLES_TRANSACTION"}
                        PROFILE_OUTGOING_CIRCLES_TRANSACTION
                    {:else if event.type === "PROFILE_INCOMING_XDAI_TRANSACTION"}
                        PROFILE_INCOMING_XDAI_TRANSACTION
                    {:else if event.type === "PROFILE_OUTGOING_XDAI_TRANSACTION"}
                        PROFILE_OUTGOING_XDAI_TRANSACTION
                    {:else if event.type === "PROFILE_INCOMING_TRUST"}
                        PROFILE_INCOMING_TRUST
                    {:else if event.type === "PROFILE_OUTGOING_TRUST"}
                        PROFILE_OUTGOING_TRUST
                    {:else if event.type === "PROFILE_INCOMING_TRUST_REVOKED"}
                        PROFILE_INCOMING_TRUST_REVOKED
                    {:else if event.type === "PROFILE_OUTGOING_TRUST_REVOKED"}
                        PROFILE_OUTGOING_TRUST_REVOKED
                    {:else}
                        Unknown event type
                    {/if}
                </div>
            </div>
        </div>
    </section>
    {/each}
</div>