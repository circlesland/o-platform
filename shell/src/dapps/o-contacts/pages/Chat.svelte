<script lang="ts">
import SimpleHeader from "src/shared/atoms/SimpleHeader.svelte";
import { me } from "../../../shared/stores/me";
import { RuntimeDapp } from "@o-platform/o-interfaces/dist/runtimeDapp";
import { Routable } from "@o-platform/o-interfaces/dist/routable";
import { Contact, ContactsDocument } from "../../../shared/api/data/types";
import ChatListCard from "../atoms/ChatListCard.svelte";
import { Subscription } from "rxjs";
import List from "../../../shared/molecules/Lists/List.svelte";

export let runtimeDapp: RuntimeDapp<any>;
export let routable: Routable;

let error: string | undefined = undefined;
let contacts: Contact[] = [];
let shellEventSubscription: Subscription;

const listArguments = {
  safeAddress: $me.circlesAddress,
};

// onMount(async () => {
//   shellEventSubscription = window.o.events.subscribe(
//     async (event: PlatformEvent) => {
//       if (event.type != "shell.refresh" || (<any>event).dapp != "chat:1") {
//         return;
//       }
//       await reload();
//     }
//   );
//   await reload();
// });

// onDestroy(() => shellEventSubscription.unsubscribe());
</script>

<SimpleHeader runtimeDapp="{runtimeDapp}" routable="{routable}" />

<div class="px-4 mx-auto -mt-3 md:w-2/3 xl:w-1/2 mb-14">
  <List
    listItemType="{Contact}"
    listItemComponent="{ChatListCard}"
    fetchQuery="{ContactsDocument}"
    fetchQueryArguments="{listArguments}"
    dataKey="contacts"
    dataLimit="{100}" />
</div>
