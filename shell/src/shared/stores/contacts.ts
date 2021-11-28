import {readable} from "svelte/store";
import {
  AggregatesDocument,
  AggregateType,
  Contact, ContactAggregateFilter, Contacts, Profile, ProfileAggregate, QueryAggregatesArgs
} from "../api/data/types";
import {me} from "./me";
import {Subscription} from "rxjs";
import {ZERO_ADDRESS} from "@o-platform/o-circles/dist/consts";
import {ApiClient} from "../apiConnection";

let contactsBySafeAddress: { [address: string]: Contact } = {};

async function loadContacts(safeAddress: string) {
  const aggregates = await ApiClient.query<ProfileAggregate[], QueryAggregatesArgs>(AggregatesDocument, {
    types: [AggregateType.Contacts],
    safeAddress: safeAddress
  });
  const foundAggregate = aggregates.find(o => o.type == AggregateType.Contacts)?.payload as Contacts;
  if (!foundAggregate) {
    throw new Error(`Couldn't find the Contacts in the query result.`);
  }

  const contactsList: Contact[] = foundAggregate.contacts.filter((o: Contact) => {
    return o.contactAddress !== ZERO_ADDRESS && o.contactAddress != safeAddress;
  });

  contactsList.forEach(o => contactsBySafeAddress[o.contactAddress] = o);

  return contactsList.sort((a, b) => {
    return a.lastContactAt > b.lastContactAt
      ? -1
      : a.lastContactAt < b.lastContactAt
        ? 1
        : 0;
  });
}

export const {subscribe} = readable<Contact[]>([], function start(set) {
  // Subscribe to $me and reload the store when the profile changes
  async function update(safeAddress: string) {
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
  findBySafeAddress: async (safeAddress: string) => {
    let _$me: Profile;
    me.subscribe($me => _$me = $me)();
    if (_$me.circlesAddress == safeAddress) {
      return <Contact>{
        contactAddress: safeAddress,
        contactAddress_Profile: _$me,
        lastContactAt: new Date().toJSON(),
        metadata: []
      };
    }
    let contact = contactsBySafeAddress[safeAddress];
    if (!contact) {
      const filteredContacts = await ApiClient.query<ProfileAggregate[], QueryAggregatesArgs>(AggregatesDocument, {
        types: [AggregateType.Contacts],
        safeAddress: safeAddress,
        filter: {
          contacts: <ContactAggregateFilter>{
            addresses: [safeAddress]
          }
        }
      });
      const foundContacts = filteredContacts.find(o => o.type == "Contacts")?.payload as Contacts;
      if (foundContacts && foundContacts.contacts.length > 0){
        contact = foundContacts.contacts[0];
        contactsBySafeAddress[contact.contactAddress] = contact;
      }
    }

    return contact;
  }
}