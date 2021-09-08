import {writable} from "svelte/store";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {AcknowledgeDocument, Profile, ProfileEvent} from "../../dapps/o-chat/data/api/types";

let events:ProfileEvent[] = [];
async function queryEvents()
{
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
        query: SafeTimelineDocument
    });
    if (result.errors) {
        console.error(result.errors);
        return [];
    }

    return result.data.events;
}


const { subscribe, set, update } = writable<ProfileEvent[]|null>(null, function start(set) {
    set([]);
    const subscription = window.o.events.subscribe(async (event: PlatformEvent & {
        profile: Profile
    }) => {
        if (event.type == "shell.loggedOut") {
            localStorage.removeItem("me");
            set([]);
            return;
        }
        // TODO: The server must push new events to the client
        if (event.type == "shell.authenticated" && event.profile) {
            events = await queryEvents();
        }
        if (event.type == "shell.refresh") {
            events = await queryEvents();
        }
        set(events);
    });

    return function stop() {
        subscription.unsubscribe();
    };
});

export const inbox = {
    subscribe,
    acknowledge: async (eventId:number) => {
        // console.log("Acking event:", eventId);
        const apiClient = await window.o.apiClient.client.subscribeToResult();
        await apiClient.mutate({
            mutation: AcknowledgeDocument,
            variables: {
                eventId: eventId
            }
        });
        const e = events.find(o => o.id == eventId);
        events.splice(events.indexOf(e), 1);
        update(() => events);
    }
};