<script lang="ts">
    import {push} from "svelte-spa-router";
    import {Offer} from "../data/api/types";
    import {RunProcess} from "@o-platform/o-process/dist/events/runProcess";
    import {shellProcess, ShellProcessContext} from "../../../shared/processes/shellProcess";
    import {purchase} from "../processes/purchase";
    import OfferCardField from "./OfferCardField.svelte";
    import {me} from "../../../shared/stores/me";
    import {upsertOffer} from "../processes/upsertOffer";
    import {upsertIdentity} from "../../o-passport/processes/upsertIdentity";

    export let offer: Offer = <any>{
        categoryTag: {
            value: "",
            id: 0
        },
        categoryTagId: 0,
        deliveryTerms: "",
        description: "",
        unit: "",
        pricePerUnit: "",
        id: 0,
        title: "",
        geonameid: 0,
        createdBy: {}
    };

    export let allowEdit:boolean = false;

    let isEditable: boolean = false;
    $: {
        isEditable = allowEdit && $me && offer && $me.id == offer.createdByProfileId;
    }

    function edit(dirtyFlags: { [fieldName: string]: boolean }) {
        console.log("edit: dirtyFlags:", dirtyFlags);

        const requestEvent = new RunProcess<ShellProcessContext>(
            shellProcess,
            true,
            async (ctx) => {
                ctx.childProcessDefinition = {
                    id: upsertOffer.id,
                    name: upsertOffer.name,
                    stateMachine: (processId?: string) =>
                        (<any>upsertOffer).stateMachine(processId, true),
                };
                ctx.childContext = {
                    data: offer,
                    dirtyFlags: dirtyFlags
                };
                return ctx;
            });

        window.o.publishEvent(requestEvent);
    }

    function loadDetailPage() {
        push("#/marketplace/offer/" + offer.id);
    }

    function buy() {
        window.o.publishEvent(
            new RunProcess<ShellProcessContext>(shellProcess, true, async (ctx) => {
                ctx.childProcessDefinition = purchase;
                ctx.childContext = {
                    data: {},
                };
                return ctx;
            })
        );
    }
</script>

<section
        class="flex items-center justify-center mb-2 text-circlesdarkblue"
        on:click|once={() => loadDetailPage()}
>
    <div class="flex items-center w-full px-4 pt-5 space-x-2 bg-white rounded-sm shadow sm:space-x-6">
        <div class="mr-2 -mt-3 text-center">
            <div class="avatar">
                <div class="w-12 h-12 m-auto rounded-full sm:w-12 sm:h-12">
                    <img src={offer.pictureUrl} alt={offer.title}/>
                </div>
            </div>
        </div>

        <div class="relative flex-grow text-left">
            <div class="max-w-full cursor-pointer">
                <h2 class="text-2xl sm:text-3xl">
                    {offer.title}
                    {#if isEditable}
                        <button class="link link-primary text-primary text-2xs"
                                on:click={() => edit({ title: true })}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 class="h-3 w-3"
                                 viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                        </button>
                    {/if}
                </h2>
                {#if offer.description}
                    <span class="inline text-dark">{offer.description}
                        {#if isEditable}
                            <button class="link link-primary text-primary text-2xs"
                                    on:click={() => edit({ description: true })}>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     class="h-3 w-3"
                                     viewBox="0 0 20 20"
                                     fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                </svg>
                            </button>
                        {/if}
                    </span>
                    <br/>
                {/if}
                <span class="inline text-sm">{offer.deliveryTerms}
                    {#if isEditable}
                        <button class="link link-primary text-primary text-2xs"
                                on:click={() => edit({ deliveryTerms: true })}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 class="h-3 w-3"
                                 viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                            </svg>
                        </button>
                    {/if}
                </span>
                <br/>
            </div>

            <OfferCardField allowEdit={allowEdit} offer={offer} field={{
                key: "categoryTag",
                title: "Category",
                valueExtractor: (offer) => offer.categoryTag.value
            }}  />
            <OfferCardField allowEdit={allowEdit} offer={offer} field={{
                key: "city",
                title: "City",
                valueExtractor: (offer) => offer.city.name
            }}  />
            <OfferCardField allowEdit={allowEdit} offer={offer} field={{
                key: "city",
                title: "Country",
                valueExtractor: (offer) => offer.city.country
            }}  />
            <OfferCardField allowEdit={allowEdit} offer={offer} field={{
                key: "unit",
                title: "Unit"
            }}  />
            <OfferCardField allowEdit={allowEdit} offer={offer} field={{
                key: "pricePerUnit",
                title: "Price per unit"
            }}  />
        </div>

        <div class="flex flex-col self-start flex-1 justify-items-end">
            <div class="flex flex-col self-end space-y-2 text-2xl sm:text-3xl ">
                <button
                        on:click={() => buy()}
                        class="self-end btn btn-square btn-md btn-primary"
                >
                    <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-10 h-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                    >
                        <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                </button>
            </div>
            <div class="self-end mt-2 text-xs text-circleslightblue">
                {offer.publishedAt} (9 days ago)
            </div>
        </div>
    </div>
</section>
