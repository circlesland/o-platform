<script lang="ts">
    import MarketplaceHeader from "../atoms/MarketplaceHeader.svelte";
    import {Offer, OffersDocument} from "../data/api/types";
    import OfferCard from "../atoms/OfferCard.svelte";
    import {onMount} from "svelte";
    import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
    import {Subscription} from "rxjs";

    export let params: {
        category: string
    };

    let isLoading: boolean;
    let error: Error;
    let offers: Offer[] = []
    let shellEventSubscription: Subscription;

    async function load() {
        if (isLoading || !params || !params.category)
            return;

        isLoading = true;
        const apiClient = await window.o.apiClient.client.subscribeToResult();
        const result = await apiClient.query({
            query: OffersDocument,
            variables: {
                category: params.category
            }
        });
        if (result.errors && result.errors.length) {
            error = new Error(`An error occurred while the offer was loaded: ${JSON.stringify(result.errors)}`);
            throw error;
        }
        isLoading = false;
        offers = result.data.offers;
    }

    onMount(async () => {
        await load();

        shellEventSubscription = window.o.events.subscribe(async (event: PlatformEvent) => {
            if (event.type != "shell.refresh" || (<any>event).dapp != "marketplace:1") {
                return;
            }
            await load();
        });

        return () => {
            shellEventSubscription.unsubscribe();
        }
    });
</script>
<MarketplaceHeader />

<div class="mx-4 -mt-6">
    {#if isLoading}
        <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
            <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
                <div class="flex flex-col items-start">
                    <div>Loading offers...</div>
                </div>
            </div>
        </section>
    {:else if error}
        <section class="flex items-center justify-center mb-2 text-circlesdarkblue">
            <div class="flex items-center w-full p-4 space-x-2 bg-white shadow ">
                <div class="flex flex-col items-start">
                    <div>
                        <b>An error occurred while loading the recent activities:</b>
                    </div>
                </div>
            </div>
        </section>
    {:else}
        {#if offers.length}
            <section class="flex items-center justify-center mb-1 ">
                <div
                        class="flex flex-col w-full p-4 space-y-2 bg-white rounded-sm shadow"
                >
                    <div class="text-xs font-bold text-left text-secondary font-circles">
                        Offers
                    </div>
                </div>
            </section>
            {#each offers as offer}
                <OfferCard offer={offer} />
            {/each}
        {:else}

        {/if}
    {/if}
</div>