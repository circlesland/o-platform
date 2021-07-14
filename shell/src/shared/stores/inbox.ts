import {readable} from "svelte/store";
import {PlatformEvent} from "@o-platform/o-events/dist/platformEvent";
import {EventsDocument, Profile, ProfileEvent} from "../../dapps/o-contacts/data/api/types";

async function queryEvents(set: (value: (ProfileEvent[] | null)) => void) {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    const result = await apiClient.query({
        query: EventsDocument
    });
    if (result.errors) {
        console.warn(result.errors);
        set([]);
        return;
    }
    set(result.data.events);
}

export const inbox = readable<ProfileEvent[]|null>(null, function start(set) {
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
            await queryEvents(set);
        }
        if (event.type == "shell.refresh") {
            await queryEvents(set);
        }
    });

    return function stop() {
        subscription.unsubscribe();
    };
});
