import {readable} from "svelte/store";
import {
  AggregatesDocument,
  AggregateType,
  Contact, Profile
} from "../api/data/types";
import {me} from "./me";
import {Subscription} from "rxjs";
import {ZERO_ADDRESS} from "@o-platform/o-circles/dist/consts";

let contactsBySafeAddress: {[address:string]:Contact} = {};

async function loadContacts(safeAddress: string) {
  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const c = await apiClient.query({
    query: AggregatesDocument,
    variables: {
      types: [AggregateType.Contacts],
      safeAddress: safeAddress
    }
  });

  if (c.errors?.length > 0) {
    let error = `Couldn't read the contacts of safe ${safeAddress}: \n${c.errors
      .map((o) => o.message)
      .join("\n")}`;

    throw new Error(error);
  }

  const contactsList:Contact[] = c.data.aggregates[0].payload.contacts.filter((o:Contact) => {
    return o.contactAddress !== ZERO_ADDRESS && o.contactAddress != safeAddress;
  });

  contactsList.forEach(o => contactsBySafeAddress[o.contactAddress] = o);

  return contactsList.sort((a,b) => {
      return a.lastContactAt > b.lastContactAt
        ? -1
        : a.lastContactAt < b.lastContactAt
          ? 1
          : 0;
    });
}

export const {subscribe} = readable<Contact[]>([], function start(set) {
  // Subscribe to $me and reload the store when the profile changes
  async function update(safeAddress:string) {
    const contacts = await loadContacts(safeAddress);
    set(contacts);
  }

  let shellEventSubscription: Subscription;

  const profileSubscription = me.subscribe(async $me => {
    if (shellEventSubscription) {
      shellEventSubscription.unsubscribe();
      shellEventSubscription = null;
    }

    if (!$me.circlesAddress) {
      console.log(`contacts: Not loaded. No safe address on profile.`);
      set([]);
      return;
    }
    console.log(`contacts: Updating for ${$me.circlesAddress} ..`);
    await update($me.circlesAddress);

    shellEventSubscription = window.o.events.subscribe(async event => {
      if (event.type == "blockchain_event") {
        console.log(`contacts: Updating because of blockchain event ..`);
        await update($me.circlesAddress);
      }
      if ((<any>event).type == "new_message") {
        console.log(`contacts: Updating because of chat message ..`);
        await update($me.circlesAddress);
      }
    });
  });

  return function stop() {
    profileSubscription();

    if (shellEventSubscription) {
      shellEventSubscription.unsubscribe();
      shellEventSubscription = null;
    }
  };
});

export const contacts = {
  subscribe: subscribe,
  findBySafeAddress: async (safeAddress:string) => {
    return contactsBySafeAddress[safeAddress];
  }
}