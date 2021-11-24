import { writable } from "svelte/store";
import {
  AcknowledgeDocument,
  Direction,
  EventType, Organisation, OrganisationsByAddressDocument, OrganisationsDocument,
  PaginationArgs,
  Profile,
  ProfileEvent,
  SortOrder,
  StreamDocument, TrustRelationsDocument,
} from "../api/data/types";
import { PlatformEvent } from "@o-platform/o-events/dist/platformEvent";
import { me } from "./me";
import { getSessionInfo } from "../../dapps/o-passport/processes/identify/services/getSessionInfo";
import {fSetTrust, setTrust} from "../../dapps/o-banking/processes/setTrust";

let events: ProfileEvent[] = [];
let following: boolean = false;

async function queryEvents() {
  const apiClient = await window.o.apiClient.client.subscribeToResult();

  // TODO: Get last acknowledged
  // TODO: Get my safe address

  const sessionInfo = await getSessionInfo();

  let mySafeAddress: string = null;
  me.subscribe(($me) => {
    mySafeAddress = $me?.circlesAddress;
  });

  let pagination: PaginationArgs = {
    order: SortOrder.Asc,
    limit: 100,
    continueAt: sessionInfo.lastAcknowledgedAt ?? new Date(0),
  };

  if (!mySafeAddress) {
    events = [];
    return;
  }

  const result = await apiClient.query({
    query: StreamDocument,
    variables: {
      safeAddress: mySafeAddress,
      pagination: pagination,
      filter: {
        direction: Direction.In,
      },
      types: [
        EventType.CrcHubTransfer,
        EventType.CrcMinting,
        EventType.CrcTrust,
        EventType.ChatMessage,
        EventType.CrcSignup,
        EventType.CrcTokenTransfer,
        // EventType.EthTransfer,
        // EventType.GnosisSafeEthTransfer,
        // EventType.InvitationCreated,
        EventType.InvitationRedeemed,
        EventType.MembershipOffer,
        EventType.MembershipAccepted,
        EventType.MembershipRejected,
      ],
    },
  });

  if (result.errors) {
    console.error(result.errors);
    return [];
  }
  return result.data.events;
}

const { subscribe, set, update } = writable<ProfileEvent[] | null>(
  null,
  function start(set) {
    set([]);

    const subscription = window.o.events.subscribe(
      async (
        event: PlatformEvent & {
          profile: Profile;
        }
      ) => {
        if (event.type == "shell.loggedOut") {
          set([]);
          return;
        }

        if ((<any>event).type == "blockchain_event") {
          inbox.reload();
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "chat:1"
          });
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "friends:1"
          });
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "banking:1"
          });
          return;
        } else if ((<any>event).type == "new_message") {
          inbox.reload();
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "chat:1"
          });
          window.o.publishEvent(<any>{
            type: "shell.refresh",
            dapp: "friends:1"
          });
          return;
        }
        if (event.type == "shell.authenticated") {
          inbox.reload();
          return;
        }
      }
    );

    return function stop() {
      subscription.unsubscribe();
    };
  }
);

export async function followTrust(profile: Profile | Organisation) {
  if (following) return;
  // Check the trust status of all members
  following = true;

  const apiClient = await window.o.apiClient.client.subscribeToResult();
  const orga = await apiClient.query({
    query: OrganisationsByAddressDocument,
    variables: {
      addresses: [profile.circlesAddress]
    }
  });

  let allTrustRelations: any[] = [];

  if (!orga.data.organisationsByAddress || !orga.data.organisationsByAddress.length) {
    console.warn("Follow trust only works in organisation context.")
    return;
  }

  const orgaTrustRelations = await apiClient.query({
    query: TrustRelationsDocument,
    variables: {
      safeAddress: profile.circlesAddress
    }
  });

  const missingMemberTrusts: {[userAddress: string]: boolean} = {};
  const currentTrust: { [userAddress: string]: boolean } = {};
  const removeTrust: { [userAddress: string]: boolean } = {};
  const addTrust: { [userAddress: string]: boolean } = {};

  orga.data.organisationsByAddress[0].members.forEach(m => {
    missingMemberTrusts[m.circlesAddress] = true;
  });

  orgaTrustRelations.data.trustRelations.forEach(t => {
    delete missingMemberTrusts[t.otherSafeAddress];
    removeTrust[t.otherSafeAddress] = true;
    currentTrust[t.otherSafeAddress] = true;
  });

  Object.keys(missingMemberTrusts).forEach(mmt => {
    addTrust[mmt] = true;
  });

  for (let member of orga.data.organisationsByAddress[0].members) {
    const memberTrustRelations = await apiClient.query({
      query: TrustRelationsDocument,
      variables: {
        safeAddress: member.circlesAddress
      }
    });
    const trusts = memberTrustRelations.data.trustRelations.filter(o => o.direction == "OUT" || o.direction == "MUTUAL");
    trusts.forEach(t => {
      delete removeTrust[t.otherSafeAddress];
      if (!currentTrust[t.otherSafeAddress]) {
        addTrust[t.otherSafeAddress] = true;
      }
    });
    allTrustRelations = [...allTrustRelations, ...trusts];
  }

  console.log("Add trust:", addTrust);
  console.log("Remove trust:", removeTrust);

  for(let address of Object.keys(removeTrust)) {
    console.log(`Removing trust to ${address}`);
    await fSetTrust({
      data: {
        safeAddress: profile.circlesAddress,
        trustLimit: 0,
        trustReceiver: address,
        privateKey: sessionStorage.getItem("circlesKey")
      },
      messages:{},
      dirtyFlags: {},
      onlyThesePages:[]
    })
  }
  for(let address of Object.keys(addTrust)) {
    console.log(`Adding trust to ${address}`);
    await fSetTrust({
      data: {
        safeAddress: profile.circlesAddress,
        trustLimit: 100,
        trustReceiver: address,
        privateKey: sessionStorage.getItem("circlesKey")
      },
      messages:{},
      dirtyFlags: {},
      onlyThesePages:[]
    })
  }

  following = false;
}

export const inbox = {
  subscribe,
  reload: () => {
    queryEvents().then(async (e) => {
      // If we're in an organisation context then find all trust changes of all members since the last update
      let profile: Profile|Organisation;
      const unsub = me.subscribe($me => {
        profile = $me;
      });
      unsub();

      if (profile && profile.__typename === "Organisation") {
        // TODO: Comment-in to enable follow trust
        //followTrust(profile);
      }

      events = e;
      set(events);

      await followTrust(profile);
    });
  },
  acknowledge: async (event: ProfileEvent) => {
    const apiClient = await window.o.apiClient.client.subscribeToResult();
    await apiClient.mutate({
      mutation: AcknowledgeDocument,
      variables: {
        until: new Date(event.timestamp).toJSON(),
      },
    });
    const e = events.find((o) => o.timestamp == event.timestamp);
    events.splice(events.indexOf(e), 1);
    update(() => events);
  },
};
